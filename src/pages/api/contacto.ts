import type { APIRoute } from 'astro';
import { CONTACT } from '../../config/site';

/**
 * Contact form handler – SSR only.
 *
 * Order of operations, all fail-closed:
 *   1. Honeypot        – silent fake success for bots
 *   2. Turnstile       – server-side siteverify, never trusts the client
 *   3. Field validation
 *   4. Resend delivery – the business only hears about a lead if this succeeds
 *
 * The client never sees a provider error. Every failure path returns a
 * generic message; the raw error stays on the server.
 */

export const prerender = false;

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';

/**
 * Verified sending domain on the agency's Resend account. Only the display
 * name is the client's — the address must stay on a domain Resend has
 * verified, so it cannot be a free mailbox.
 */
const MAIL_FROM = 'LPC Immigration Services <contacto@notify.programacionconecta.com>';

type Lang = 'es' | 'en';

const COPY = {
  es: {
    verification:
      'No pudimos verificar la solicitud. Recargue la página e intente de nuevo, o escríbanos por WhatsApp.',
    required: 'Por favor complete su nombre y su correo.',
    failed:
      'No pudimos enviar su mensaje. Intente de nuevo o escríbanos directamente por WhatsApp.',
    success: 'Gracias. Nos pondremos en contacto por WhatsApp o correo en menos de 24 horas.',
  },
  en: {
    verification:
      'We could not verify this request. Please reload the page and try again, or contact us on WhatsApp.',
    required: 'Please fill in your name and email.',
    failed: 'We could not send your message. Please try again or contact us directly on WhatsApp.',
    success: "Thank you. We'll get back to you by WhatsApp or email within 24 hours.",
  },
} as const satisfies Record<Lang, Record<string, string>>;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Escapes user input before it is interpolated into the notification HTML. */
const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  // Default to Spanish: it is the primary audience, and a malformed request
  // that never reaches the lang lookup should still read naturally.
  let lang: Lang = 'es';

  try {
    const formData = await request.formData();
    const name = formData.get('nombre')?.toString().trim() || '';
    const phone = formData.get('tel')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const caseType = formData.get('caso')?.toString().trim() || '';
    const message = formData.get('msg')?.toString().trim() || '';
    const hp = formData.get('hp')?.toString() || ''; // honeypot
    lang = formData.get('lang')?.toString() === 'en' ? 'en' : 'es';
    const t = COPY[lang];

    // ── 1. Honeypot (bot filter) ──
    // A real visitor never fills this hidden field. Answer with a plain
    // success so the bot has no signal that it was caught.
    if (hp) {
      return json({ ok: true, message: t.success }, 200);
    }

    // ── 2. Turnstile verification (fail closed) ──
    // Runs before validation and before delivery: an unverified request
    // never reaches either. Every failure path returns the same generic
    // message, so a probing client learns nothing.
    const secret = locals.runtime?.env?.TURNSTILE_SECRET;
    if (!secret) {
      // Misconfigured environment. Reject rather than let traffic through.
      return json({ ok: false, error: t.verification }, 403);
    }

    const token = formData.get('cf-turnstile-response')?.toString() || '';
    const remoteip = request.headers.get('CF-Connecting-IP') || clientAddress || '';

    let verification: { success?: boolean };
    try {
      const verifyRes = await fetch(SITEVERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token, remoteip }),
      });
      if (!verifyRes.ok) throw new Error(`siteverify ${verifyRes.status}`);
      verification = await verifyRes.json();
    } catch {
      // Network error, non-2xx, or non-JSON body from siteverify.
      return json({ ok: false, error: t.verification }, 403);
    }

    if (verification?.success !== true) {
      return json({ ok: false, error: t.verification }, 403);
    }

    // ── 3. Validation ──
    if (!name || !email) {
      return json({ ok: false, error: t.required }, 400);
    }

    // ── 4. Delivery via Resend ──
    const apiKey = locals.runtime?.env?.RESEND_API_KEY;
    if (!apiKey) {
      return json({ ok: false, error: t.failed }, 500);
    }

    const rows: Array<[string, string]> = [
      ['Nombre', name],
      ['Teléfono / WhatsApp', phone || '—'],
      ['Correo', email],
      ['Tipo de caso', caseType || '—'],
      ['Idioma del formulario', lang === 'en' ? 'Inglés' : 'Español'],
      ['Mensaje', message || '—'],
    ];

    const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
    const html = `<h2>Nueva consulta desde lpcimmigration.com</h2><table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows
      .map(
        ([label, value]) =>
          `<tr><td style="border:1px solid #ddd"><strong>${esc(label)}</strong></td><td style="border:1px solid #ddd">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('')}</table>`;

    try {
      const sendRes = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [...CONTACT.formInbox],
          reply_to: email,
          subject: `Nueva consulta de ${name}${caseType ? ` — ${caseType}` : ''}`,
          text,
          html,
        }),
      });

      if (!sendRes.ok) {
        // Resend rejected the send (bad key, unverified domain, rate limit).
        // The visitor must NOT be told their message went through.
        throw new Error(`resend ${sendRes.status}`);
      }
    } catch {
      return json({ ok: false, error: t.failed }, 502);
    }

    // ── Success: the email is actually accepted by Resend at this point ──
    return json({ ok: true, message: t.success }, 200);
  } catch {
    // NEVER expose the raw error to the client.
    return json({ ok: false, error: COPY[lang].failed }, 500);
  }
};

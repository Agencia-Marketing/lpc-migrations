import type { APIRoute } from 'astro';

/**
 * Contact form handler – SSR only.
 *
 * In production:
 * - Validate Cloudflare Turnstile token
 * - Send email via Resend
 * - Return generic success/error (never expose raw provider errors)
 */

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('nombre')?.toString() || formData.get('name')?.toString() || '';
    const phone = formData.get('tel')?.toString() || formData.get('phone')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const caseType = formData.get('caso')?.toString() || formData.get('case')?.toString() || '';
    const message = formData.get('msg')?.toString() || '';
    const hp = formData.get('hp')?.toString() || ''; // honeypot

    // ── Honeypot check (bot filter) ──
    if (hp) {
      // Bot detected – respond as success silently
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Validation ──
    if (!name || !email) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Por favor completa los campos requeridos. / Please fill in the required fields.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Turnstile validation would go here ──
    // const token = formData.get('cf-turnstile-response')?.toString();
    // const ip = request.headers.get('CF-Connecting-IP') || clientAddress;
    // const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    //   method: 'POST',
    //   body: `secret=${import.meta.env.TURNSTILE_SECRET}&response=${token}&remoteip=${ip}`,
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // });
    // const turnstileData = await turnstileRes.json();
    // if (!turnstileData.success) { ... }

    // ── Resend email would go here ──
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'notify.programacionconecta.com',
    //     to: 'lpcimmigrationservices@gmail.com',
    //     subject: `Nueva consulta de ${name}`,
    //     text: `Nombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}\nTipo de caso: ${caseType}\nMensaje: ${message}`,
    //   }),
    // });

    // ── Success ──
    return new Response(
      JSON.stringify({
        ok: true,
        message:
          'Gracias. Nos pondremos en contacto por WhatsApp o correo en menos de 24 horas.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    // NEVER expose the raw error to the client
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'Ocurrió un error al enviar el formulario. Intenta de nuevo o escríbenos por WhatsApp.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

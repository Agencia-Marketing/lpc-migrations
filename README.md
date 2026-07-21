# LPC Services — Sitio web

[LPC Services](https://lpc-services.com) prepara y organiza la documentación de procesos migratorios en Estados Unidos. Este repositorio contiene el código fuente de su sitio web institucional.

> **⚠️ Aviso legal**: LPC Services **no es una firma de abogados**. Brinda servicios de preparación de documentos y asistencia administrativa. No ofrece asesoría legal ni recomienda qué vía migratoria seguir.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Astro](https://astro.build) 5 — generación de sitios estáticos |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) + SSR Function |
| Adaptador | [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/deploy/cloudflare/) |
| Contenido | Content Collections (Markdown + Zod) |
| i18n | Routing nativo de Astro: `/` (español), `/en/` (inglés) |
| Estilos | CSS custom properties — tema claro institucional |
| Email | Resend (transaccional, vía SSR Function) |
| Captcha | Cloudflare Turnstile |
| Chat | GoHighLevel |
| SEO | `@astrojs/sitemap`, hreflang, JSON-LD |
| QA | Vitest + Playwright + Miniflare |

---

## Estructura del proyecto

```
src/
├── config/
│   └── site.ts              # Fuente de verdad: contacto, redes, navegación
├── content/
│   ├── config.ts            # Esquemas Zod (servicios, testimonios, faqs)
│   ├── servicios/           # Contenido bilingüe de servicios
│   ├── testimonios/         # Testimonios de clientes
│   └── faqs/                # Preguntas frecuentes
├── layouts/
│   └── Layout.astro         # Layout base con i18n, SEO, hreflang
├── components/
│   ├── Header.astro         # Barra de navegación sticky
│   ├── Footer.astro         # Pie de página
│   └── WhatsAppFloat.astro  # Botón flotante de WhatsApp
├── pages/
│   ├── index.astro          # Portada (ES)
│   ├── contacto.astro       # Contacto (ES)
│   ├── nosotros.astro       # Nosotros (ES)
│   ├── servicios/
│   │   ├── index.astro      # Índice de servicios (ES)
│   │   └── [slug].astro     # Detalle de servicio (ES)
│   ├── en/                  # Versiones en inglés
│   └── api/
│       └── contacto.ts      # SSR — única ruta dinámica
├── styles/
│   └── global.css           # Tokens de diseño y componentes base
public/
└── assets/
    └── lpc-logo.png         # Logo de la marca
```

### Páginas generadas (14 rutas estáticas)

| Ruta | Contenido |
|------|-----------|
| `/` | Portada (ES) |
| `/en/` | Home (EN) |
| `/contacto` | Contacto (ES) |
| `/en/contacto` | Contact (EN) |
| `/nosotros` | Nosotros (ES) |
| `/en/nosotros` | About (EN) |
| `/servicios` | Índice de servicios (ES) |
| `/en/servicios` | Services index (EN) |
| `/servicios/asilo` | Asilo afirmativo (ES) |
| `/servicios/visa-eb2` | Visa EB-2 NIW (ES) |
| `/servicios/visa-u` | Visa U (ES) |
| `/en/servicios/asilo` | Affirmative Asylum (EN) |
| `/en/servicios/visa-eb2` | EB-2 NIW Visa (EN) |
| `/en/servicios/visa-u` | U Visa (EN) |

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Build de producción
npm run build

# 4. Preview local con Miniflare (simula Cloudflare Pages)
npm run preview:cf
```

### Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción | Proveedor |
|----------|-------------|-----------|
| `RESEND_API_KEY` | API key para envío de correos | [Resend](https://resend.com) |
| `TURNSTILE_SECRET` | Secret key para validación de Turnstile | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| `TURNSTILE_SITE_KEY` | Site key para el widget del frontend | Cloudflare Turnstile |

> ⚠️ **Nunca versionar secrets en el repo.** En producción se configuran con `wrangler secret put`.

---

## Despliegue

### Cloudflare Pages (recomendado)

El proyecto está configurado para deploy automático desde GitHub:

1. Conecta el repo en [Cloudflare Pages](https://pages.cloudflare.com)
2. Framework preset: **Astro**
3. Build command: `npm run build`
4. Build output: `dist`

### Manual

```bash
npm run deploy
# Ejecuta: astro build && wrangler pages deploy dist
```

> ⚠️ Antes del deploy a producción, configurar secrets con `wrangler secret put`.

---

## Diseño

El diseño base proviene de un bundle exportado de Claude Design con el sistema **modernist** (tema claro, azul profundo, tipografía Archivo, bordes de 2px, layout de cuadrícula modular). Los archivos de referencia están en:

- [`design/`](./design/) — Mockups HTML de la portada
- [`lpc-services-homepage-design/`](./lpc-services-homepage-design/) — Bundle completo con todas las páginas prototipo

---

## Fases del proyecto

| Fase | Estado | Descripción |
|------|--------|-------------|
| 1 | ✅ | Content Collections + esquemas Zod + contenido bilingüe |
| 2 | ✅ | Layout, i18n, componentes, páginas estáticas |
| 3 | 🔄 | Canales de contacto (SSR, Resend, Turnstile) |
| 4 | ⬜ | SEO técnico avanzado |
| 5 | ⬜ | QA con Vitest + Playwright + Miniflare |
| 6 | ⬜ | Corte de dominio y entrega |

---

## Licencia

Proyecto privado — [Agencia Marketing](https://programacionconecta.com)

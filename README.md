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
│   ├── Header.astro         # Barra de navegación sticky + dropdown de servicios
│   ├── Footer.astro         # Pie de página
│   ├── ServiceIcon.astro    # SVG de los iconos de servicio (campo `icon`)
│   └── WhatsAppFloat.astro  # Botón flotante — NO montado en el Layout
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

### Páginas generadas (24 rutas estáticas)

Ocho páginas base (4 × 2 idiomas) más una página por servicio:

| Ruta | Contenido |
|------|-----------|
| `/` · `/en/` | Portada / Home |
| `/contacto` · `/en/contacto` | Contacto / Contact |
| `/nosotros` · `/en/nosotros` | Nosotros / About |
| `/servicios` · `/en/servicios` | Índice de servicios / Services index |

Los ocho servicios se generan con `getStaticPaths` desde la colección, en ambos
idiomas (`/servicios/<slug>` y `/en/servicios/<slug>`). El `urlSlug` es el mismo
en los dos idiomas:

| Orden | Slug | Servicio | Formulario |
|-------|------|----------|------------|
| 01 | `asilo-afirmativo` | Asilo afirmativo | I-589 |
| 02 | `asilo-defensivo` | Asilo defensivo | I-589 |
| 03 | `visa-eb2` | Visa EB-2 NIW | I-140 |
| 04 | `visa-u` | Visa U | I-918 |
| 05 | `visa-juvenil` | Visa Juvenil (SIJS) | I-360 |
| 06 | `visa-b1-b2` | Visa B1/B2 | DS-160 |
| 07 | `ajuste-de-estatus` | Ajuste de estatus | I-485 |
| 08 | `proceso-consular` | Proceso consular | DS-260 |

> Para añadir un servicio basta con crear `es-<nombre>.md` y `en-<nombre>.md` en
> `src/content/servicios/`. El menú del header, la portada, el índice de servicios
> y la ruta de detalle lo recogen solos. Si el `icon` del frontmatter es nuevo,
> hay que añadir su SVG a `src/components/ServiceIcon.astro`.

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

### Estado actual: nada publicado

**El sitio no se ha desplegado todavía.** No hay CI conectado (no existe
`.github/workflows/`), así que hacer push a `master` **no publica nada**. El
dominio `lpc-services.com` sigue sirviendo el sitio anterior: la zona DNS
todavía está en la cuenta de Cloudflare del proveedor previo y su migración es
parte de la Fase 6.

Para revisar el sitio: `npm run dev` (local) o `npm run preview:cf` (Miniflare,
simula el runtime de Cloudflare).

### Bloqueantes antes del primer deploy

| Pendiente | Dónde | Por qué bloquea |
|-----------|-------|-----------------|
| KV `SESSION` sin crear | `wrangler.jsonc` (líneas comentadas) | `@astrojs/cloudflare` lo exige para SSR; sin él falla la ruta del formulario |
| Envío por Resend comentado | `src/pages/api/contacto.ts` | El formulario no manda correo |
| Turnstile sin implementar | Fase 3 | Formulario sin protección anti-bot |
| Secrets sin cargar | `wrangler secret put` | `RESEND_API_KEY`, `TURNSTILE_SECRET` |

### Manual (cuando se levanten los bloqueantes)

```bash
npm run deploy
# Ejecuta: astro build && wrangler pages deploy dist
```

### Automático desde GitHub (opcional, aún sin configurar)

1. Conecta el repo en [Cloudflare Pages](https://pages.cloudflare.com)
2. Framework preset: **Astro**
3. Build command: `npm run build`
4. Build output: `dist`

> ⚠️ Antes del deploy a producción, configurar secrets con `wrangler secret put`.
> Nunca en el repo ni en archivos `.env` versionados.

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
| 3 | 🔄 | Canales de contacto: ruta SSR creada; faltan Resend activo, Turnstile y KV `SESSION` |
| 4 | ⬜ | SEO técnico avanzado |
| 5 | ⬜ | QA con Vitest + Playwright + Miniflare |
| 6 | ⬜ | Corte de dominio y entrega |

### Contenido: fuentes de verdad

- **Contacto** (teléfono, WhatsApp, correo, horarios, redes): `src/config/site.ts`.
  Ningún componente debe llevar el número escrito a mano.
- **Servicios, testimonios y FAQs**: Markdown en `src/content/`, con esquemas Zod
  en `src/content/config.ts`. Sin CMS ni base de datos.
- **Textos de interfaz**: no hay diccionario i18n. Las cadenas viven inline como
  ternarios `lang === 'en' ? … : …`, o duplicadas en las páginas `/en/`. Un cambio
  de copy en la portada o en la bio toca **cuatro archivos**: la página ES, la EN,
  y sus equivalentes en la portada.

### Regla de copy (riesgo UPL)

Todo el texto debe hablar de **preparación y organización de documentos**. Las
decisiones sobre qué vía migratoria corresponde a cada caso se atribuyen siempre
al abogado licenciado. No usar lenguaje de estrategia legal, no evaluar
elegibilidad y no prometer resultados.

---

## Licencia

Proyecto privado — [Agencia Marketing](https://programacionconecta.com)

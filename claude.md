# Proyecto: Sitio web LPC Services

## Contexto del negocio
LPC Services ofrece servicios de preparación de documentos migratorios
en EE.UU., dirigidos a un público hispanohablante (México, Centroamérica,
Sudamérica). NO es una firma de abogados y no ofrece asesoría legal:
todo el copy debe usar lenguaje de "preparación de documentos" y
"asistencia administrativa", nunca "estrategia legal" ni recomendaciones
de vía migratoria (riesgo de práctica no autorizada de la ley).

Este sitio reemplaza uno anterior (hecho por otra persona) cuyo formulario
de contacto y chat estaban rotos, sin teléfono ni WhatsApp visibles. El
objetivo central del proyecto es que TODOS los canales de contacto
funcionen y estén probados antes de entregar.

Sitio bilingüe español (principal) e inglés.

## Stack
- Astro con @astrojs/cloudflare en modo `hybrid`: estático por defecto,
  SSR SOLO en la ruta del formulario.
- SIN CMS. El contenido vive en Content Collections (archivos Markdown
  versionados en el repo) con esquemas tipados por Zod.
- Paquetes compartidos del monorepo: @agencia/bloques, @agencia/ui-astro
- Theming por CSS custom properties — tema CLARO institucional
  (fondos claros, azul profundo, acento sobrio). El sitio viejo era
  oscuro y de bajo contraste; no repetir eso.
- Sistema de cinco bloques para el maquetado
- QA con el arnés: Vitest + Playwright + Miniflare
- NO se usa D1 ni R2 en este proyecto.

## Reglas no negociables
- Secretos SIEMPRE con `wrangler secret put`. NUNCA en el repo, en
  archivos .env versionados, ni impresos en consola.
- Correo transaccional vía Resend:
  - from = notify.programacionconecta.com (dominio de agencia ya verificado)
  - to = correo del negocio del cliente
- Manejo de errores del formulario: SIEMPRE devolver un mensaje genérico
  al usuario. NUNCA exponer el error crudo del proveedor (el sitio viejo
  filtraba el Gmail del dueño por hacer justo esto).
- Cloudflare Turnstile en el formulario, validado en el servidor.
- Slugs descriptivos: /servicios/asilo, /servicios/visa-eb2. NUNCA
  genéricos tipo service-1.
- Todo el contenido debe renderizar en el HTML estático, sin depender
  de animaciones JS (el sitio viejo mostraba secciones en negro por
  reveal-on-scroll roto).
- NO tocar el dominio de producción ni hacer deploy hasta la Fase 6.
  Trabajar todo en local (Miniflare) y en preview.
- Plan antes de código: en cada fase, primero proponer el plan y esperar
  aprobación explícita antes de implementar.

## Internacionalización
- i18n nativo de Astro. Routing: `/` para español, `/en/` para inglés.
- Contenido bilingüe con carpeta por idioma:
  src/content/servicios/es/asilo.md  y  src/content/servicios/en/asylum.md
- hreflang en todas las páginas.

## Estructura de contenido (sin base de datos)
- Content Collections con Zod:
  - servicios: título, slug, descripción SEO, cuerpo, imagen, orden
  - testimonios: nombre, texto, tipo de caso, inicial o foto
  - faqs: pregunta, respuesta, orden
- Datos de contacto y sociales en un único src/config/site.ts
  (fuente de verdad para WhatsApp, teléfono, correo, enlaces).

## Plan por fases
FASE 1 — Content Collections
  Definir esquemas Zod de servicios, testimonios y faqs. Estructura
  bilingüe por carpeta de idioma. Crear src/config/site.ts con los
  datos de contacto. Cargar el contenido real de los servicios.

FASE 2 — Layout, i18n y bloques
  Routing bilingüe (/ y /en/) con i18n de Astro y hreflang. Layouts y
  componentes con @agencia/bloques y @agencia/ui-astro, tema claro de LPC.
  Plantillas: portada (hero con CTA + servicios + testimonios + FAQ +
  contacto), servicio individual vía getStaticPaths, nosotros, contacto,
  aviso legal. Todo renderiza en HTML estático.

FASE 3 — Canales de contacto (corazón del proyecto)
  Ruta SSR única src/pages/api/contacto.ts con `export const prerender =
  false`. Envío por Resend (from notify.programacionconecta.com), manejo
  de errores genérico, validación de Turnstile en el servidor, botón de
  WhatsApp flotante persistente. Secretos con wrangler secret put.

FASE 4 — SEO técnico y rendimiento
  Componente <SEO> con título y meta únicos por página desde el frontmatter.
  @astrojs/sitemap, JSON-LD de negocio local, hreflang, imágenes
  optimizadas. Rendimiento sale casi gratis por ser estático.

FASE 5 — QA con el arnés (Vitest + Playwright + Miniflare)
  Prueba estrella: enviar el formulario y confirmar recepción real del
  correo. Test de render móvil, contraste AA, y verificación de que NO
  hay enlaces muertos. Revisión ortográfica final en ambos idiomas.

FASE 6 — Corte de dominio y entrega
  Migrar zona DNS de lpc-services.com a la cuenta Cloudflare del cliente,
  desplegar en Cloudflare Pages (con la función SSR del endpoint), registros
  de Turnstile en ese DNS, publicar. Alta en Search Console (cuenta del
  cliente, tú delegado). Documento de entrega de accesos + capacitación.


Resumen:
  No son abogados, pero cuentan con un equipo de abogados para llevar los casos
  Visas ED2-NIW: Personas con maestria o doctorado con 5 años de experiencia
  Asilos afirmativos: Aquellas personas que entraron legalmente a estados unidos
  Visa tipo U: Personas víctimas de delitos en sus países que buscan una salida (asilo) en EUA
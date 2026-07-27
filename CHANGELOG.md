# Changelog — LPC Services

Todas las actualizaciones importantes del proyecto.

---

## [Última] — 2026-07-27

Ronda de correcciones del cliente sobre datos reales del negocio.

### Agregado
- **Cinco servicios nuevos con página propia** (ES + EN), completando los ocho que
  atiende el negocio: asilo defensivo (I-589), visa juvenil SIJS (I-360),
  visa B1/B2 (DS-160), ajuste de estatus (I-485) y proceso consular (DS-260).
- Copy ampliado en los siete servicios con la información aportada por el cliente:
  plazo de un año del asilo afirmativo, requisitos de forma del relato,
  certificación policial I-918B como paso decisivo de la visa U, edad límite
  variable por estado en SIJS y manejo de ingresos con ITIN, peso de la entrada
  inspeccionada, y el perdón legal + salida del país del proceso consular.
- Enlaces cruzados entre pares de servicios que se confunden con facilidad
  (asilo afirmativo ↔ defensivo, ajuste de estatus ↔ proceso consular).
- `formNumber` en visa EB-2 NIW (I-140) y visa U (I-918); eran las únicas
  tarjetas sin formulario visible.
- Componente `ServiceIcon.astro` como fuente única de los SVG de servicio.

### Corregido
- **WhatsApp y teléfono**: el número correcto es **+1 206 572 5753**. El anterior
  (206 578 8205) era erróneo.
- **Enlace de correo del footer**: le faltaba el prefijo `mailto:`, así que
  apuntaba a una ruta relativa inexistente.
- Bio del fundador (portada y `/nosotros`, ambos idiomas): el abogado es **David
  Stuart**, no Stewart; el cargo es **Analista Externo de Casos Migratorios**;
  el grado asociado finaliza en **diciembre de 2026**, no en mayo de 2027.
- CSS de la grid de servicios: con ocho tarjetas en tres columnas, las filas 2 y 3
  quedaban con un borde izquierdo suelto y sin separador horizontal.

### Modificado
- El slug `/servicios/asilo` pasa a **`/servicios/asilo-afirmativo`**, para que el
  par con `asilo-defensivo` sea simétrico. El sitio no está publicado, así que el
  renombrado no rompe enlaces vivos.
- Orden de los servicios: 01 asilo afirmativo, 02 asilo defensivo, 03 EB-2 NIW,
  04 visa U, 05 visa juvenil, 06 B1/B2, 07 ajuste de estatus, 08 proceso consular.
- Formación especializada de la bio: añadidas visa juvenil, B1/B2 y EB-2 NIW.
- Select de tipo de caso del formulario (cuatro copias) alineado a los ocho casos.

### Eliminado
- Filas de tags «También atendemos» de la portada y del índice de servicios: ya no
  queda ningún caso sin página propia.
- Opciones «Disolución de matrimonio» y «Planificación de caso» del formulario, por
  no estar en la lista de casos que confirmó el cliente.

---

## 2026-07-21

### Corregido
- Nombre del proyecto en `wrangler.jsonc` actualizado de `lpc-services` a `lpc-migrations` para que coincida con el proyecto en Cloudflare Pages.

### Agregado
- Imagen real del equipo (`2149828124.jpg`) en el hero de la portada (español e inglés).
- Foto real de Luis (`LPC.jpg`) en la sección Nosotros (español e inglés).
- Optimización de imágenes: LPC.jpg de 4.7 MB → 61 KB, hero de 1.4 MB → 210 KB.

### Eliminado
- Botón flotante de WhatsApp (WhatsAppFloat) del layout global.

### Modificado
- Hero section agrandado: heading 58 px, más padding vertical, descripción más grande, gradientes decorativos de fondo.
- Header renovado con dropdown de servicios dinámico desde Content Collections y soporte i18n.

---

## 2026-07-21 (anterior)

### Agregado
- README con stack, contexto del negocio y setup del proyecto.
- Script de chat GoHighLevel en el Layout para atención al cliente.
- Logo PNG real de LPC Services.
- Página índice de servicios.
- Páginas de servicio individual con `getStaticPaths`.

### Inicio del proyecto
- Setup inicial: Astro + Cloudflare Pages + Content Collections.
- Routing bilingüe español/inglés.
- Esquemas Zod para servicios, testimonios y FAQs.
- Layout, Header y Footer base.

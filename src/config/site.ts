/**
 * LPC Services — Site Configuration
 *
 * Single source of truth for contact data, social links,
 * and site-wide settings. Import this instead of hard-coding
 * values across components.
 */
export const SITE = {
  name: 'LPC Services',
  tagline: 'Immigration Services',
  url: 'https://lpc-services.com',
  locale: 'es',
  locales: ['es', 'en'] as const,
  defaultLocale: 'es' as const,
  description:
    'LPC Services prepara y organiza la documentación de procesos migratorios en Estados Unidos. No somos una firma de abogados.',
  descriptionEn:
    'LPC Services prepares and organizes immigration document processes in the United States. We are not a law firm.',
} as const;

export const CONTACT = {
  phone: '+1 206 578 8205',
  phoneHref: '+12065788205',
  email: 'lpcimmigrationservices@gmail.com',
  whatsApp: 'https://wa.me/12065788205',
  whatsAppText: '+1 206 578 8205',
  hours: {
    weekdays: '9:00 a.m. – 6:00 p.m.',
    saturday: 'Con cita previa / By appointment only',
  },
} as const;

export const SOCIAL = {
  instagram: {
    label: '@lpcservices_llc',
    url: 'https://instagram.com/lpcservices_llc',
  },
  tiktok: {
    label: '@lpcservicesllc',
    url: 'https://www.tiktok.com/@lpcservicesllc',
  },
  facebook: {
    label: 'LPC Immigration Services',
    url: '#',
  },
} as const;

export const NAV = [
  { label: 'Inicio', labelEn: 'Home', href: '/' },
  { label: 'Servicios', labelEn: 'Services', href: '/servicios' },
  { label: 'Nosotros', labelEn: 'About', href: '/nosotros' },
  { label: 'Contacto', labelEn: 'Contact', href: '/contacto' },
] as const;

export const TRUST = [
  { value: '20+', labelEs: 'años de experiencia', labelEn: 'years of experience' },
  { value: '500+', labelEs: 'expedientes preparados', labelEn: 'cases prepared' },
  { value: '24h', labelEs: 'respuesta hábil', labelEn: 'response time' },
] as const;

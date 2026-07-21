import { defineCollection, z } from 'astro:content';

/**
 * ── Servicios (immigration services) ──
 */
const serviciosSchema = z.object({
  title: z.string(),
  titleEn: z.string(),
  urlSlug: z.string(),
  description: z.string(),
  descriptionEn: z.string(),
  icon: z.string().default('shield'),
  order: z.number().int().positive(),
  formNumber: z.string().optional(),
  formNumberEn: z.string().optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * ── Testimonios (testimonials) ──
 */
const testimoniosSchema = z.object({
  name: z.string(),
  text: z.string(),
  textEn: z.string(),
  caseType: z.string(),
  caseTypeEn: z.string(),
  initial: z.string().length(1),
  color: z.string().default('var(--color-accent)'),
  order: z.number().int().positive().default(1),
});

/**
 * ── FAQs (preguntas frecuentes) ──
 */
const faqsSchema = z.object({
  question: z.string(),
  questionEn: z.string(),
  answer: z.string(),
  answerEn: z.string(),
  order: z.number().int().positive().default(1),
});

export const collections = {
  servicios: defineCollection({
    type: 'content',
    schema: serviciosSchema,
  }),
  testimonios: defineCollection({
    type: 'content',
    schema: testimoniosSchema,
  }),
  faqs: defineCollection({
    type: 'content',
    schema: faqsSchema,
  }),
};

export type Servicio = z.infer<typeof serviciosSchema>;
export type Testimonio = z.infer<typeof testimoniosSchema>;
export type Faq = z.infer<typeof faqsSchema>;

import { z } from 'zod'
import { SITE } from '../data/site'

/**
 * There is no backend. The form validates locally and hands off to WhatsApp
 * with the details pre-written, which is where this client answers anyway —
 * a form that silently POSTs nowhere is worse than no form at all.
 */

export const SHOOT_TYPES = [
  'Wedding film',
  'Wedding + photography',
  'Pre-wedding',
  'Engagement / reception',
  'Brand or event',
] as const

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please tell me your name'),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Enter a phone number I can reach you on'),
  city: z.string().trim().min(2, 'Which city is the shoot in?'),
  date: z.string().min(1, 'Pick your date — an approximate one is fine'),
  type: z.enum(SHOOT_TYPES),
  message: z.string().trim().max(600, 'Keep it under 600 characters').optional(),
})

export type Enquiry = z.infer<typeof enquirySchema>
export type FieldErrors = Partial<Record<keyof Enquiry, string>>

/** Zod issues → one message per field, which is all the UI can show anyway. */
export const toFieldErrors = (error: z.ZodError<Enquiry>): FieldErrors => {
  const flattened = z.flattenError(error).fieldErrors
  return Object.fromEntries(
    Object.entries(flattened).map(([key, messages]) => [key, messages?.[0]]),
  ) as FieldErrors
}

export const enquiryHref = (data: Enquiry) => {
  const lines = [
    `Hi ${SITE.name.split(' ')[0]}, I'd like to check your availability.`,
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Shoot: ${data.type}`,
    `City: ${data.city}`,
    `Date: ${data.date}`,
    data.message ? `Details: ${data.message}` : '',
  ].filter(Boolean)

  return `https://wa.me/${SITE.phone.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`
}

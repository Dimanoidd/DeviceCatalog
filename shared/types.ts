import { z } from 'zod'

export const CATEGORIES = ['smartphone', 'wearable', 'accessory'] as const
export const categorySchema = z.enum(CATEGORIES)

export const BADGES = ['top', 'new', 'sale'] as const
export const badgeSchema = z.enum(BADGES).nullable()

const deviceBase = {
  id: z.string(),
  slug: z.string(),
  brand: z.string(),
  model: z.string(),
  priceMDL: z.number().int().positive(),
  oldPriceMDL: z.number().int().positive().nullable(),
  inStock: z.boolean(),
  badge: badgeSchema,
  image: z.string(),
};

const screenSpecs = z.object({
  display: z.string(),
  storage: z.string(),
  battery: z.string(),
});

const accessorySpecs = z.object({
  type: z.string(),
  anc: z.string(),
  battery: z.string(),
});

export const deviceSchema = z.discriminatedUnion('category', [
  z.object({ ...deviceBase, category: z.literal('smartphone'), specs: screenSpecs }),
  z.object({ ...deviceBase, category: z.literal('wearable'), specs: screenSpecs }),
  z.object({ ...deviceBase, category: z.literal('accessory'), specs: accessorySpecs }),
]);
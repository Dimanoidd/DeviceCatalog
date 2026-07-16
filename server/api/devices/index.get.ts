import { querySchema, type DevicesResponse } from '#shared/types';

export default defineEventHandler((event): DevicesResponse => {
  // getQuery returns raw string params; Zod coerces + validates them.
  const parsed = querySchema.safeParse(getQuery(event))

  if (!parsed.success) {
    // Reachable only for genuinely un-coercible input (e.g. sort=nonsense
    // that .catch() didn't rescue). Fail loud with a 400 + field details.
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: parsed.error.flatten().fieldErrors,
    })
  }

  const items = queryDevices(parsed.data)
  const facets = getFacets()

  return {
    items,
    total: items.length,
    brands: facets.brands,
    priceBounds: facets.priceBounds,
  }
  
});

export function discountPercent(price: number, oldPrice: number | null): number | null {
  if (oldPrice === null || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}
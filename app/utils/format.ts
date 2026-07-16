
/* Discount percentage, or null when there is no genuine discount. */
export function discountPercent(price: number, oldPrice: number | null): number | null {
  if (oldPrice === null || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}


/* Format a MDL amount, e.g. 21999 -> "21 999 MDL". */
export function formatMdl(amount: number): string {
  return `${new Intl.NumberFormat('ro-MD').format(amount)} MDL`
}
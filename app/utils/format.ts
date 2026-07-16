export function discountPercent(price: number, oldPrice: number | null): number | null {
  if (oldPrice === null || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}

export function formatMdl(amount: number): string {
  return `${new Intl.NumberFormat('ro-MD').format(amount)} MDL`
}
export function euPriceFormat(price: string | number | undefined) {
  if (price === undefined) return "";
  return new Intl.NumberFormat("de-DE", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price));
}

export const ZIG_PER_USD = 40;

export function fromUsd(amount, currency) {
  return currency === "ZiG"
    ? Number(amount || 0) * ZIG_PER_USD
    : Number(amount || 0);
}

export function formatCurrency(amount, currency) {
  const value = fromUsd(amount, currency);
  return `${currency === "ZiG" ? "ZiG " : "$"}${value.toFixed(2)}`;
}

export function formatCompactCurrency(amount, currency) {
  const value = fromUsd(amount, currency);
  return `${currency === "ZiG" ? "ZiG " : "$"}${value / 1000}k`;
}

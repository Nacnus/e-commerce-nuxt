export const moneyFormat= new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
}).format

export function truncateText(text, length = 62) {
  return text ? (text.length > length ? text.slice(0, length) + '...' : text) : '';
}

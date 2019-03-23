export default function(amount) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  };
  // if it's a whole Euro amount, leave off the ,00
  if (amount % 100 === 0) options.minimumFractionDigits = 0;
  const formatter = new Intl.NumberFormat('fi-FI', options);
  return formatter.format(amount / 100);
}

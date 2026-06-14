export function formatCurrency(amount: number, symbol: string, code: string = 'USD') {
  // Map currency codes to appropriate locales for correct formatting rules
  const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'INR': 'en-IN',
    'JPY': 'ja-JP'
  };
  
  const locale = localeMap[code] || 'en-US';
  const isNoDecimal = code === 'JPY';

  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: isNoDecimal ? 0 : 2,
    maximumFractionDigits: isNoDecimal ? 0 : 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

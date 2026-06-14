
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

export function getAutoEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('shop') || n.includes('buy') || n.includes('store') || n.includes('mall') || n.includes('bag')) return '🛍️';
  if (n.includes('game') || n.includes('play') || n.includes('xbox') || n.includes('ps5') || n.includes('switch')) return '🎮';
  if (n.includes('food') || n.includes('eat') || n.includes('pizza') || n.includes('restaurant') || n.includes('snack') || n.includes('drink')) return '🍕';
  if (n.includes('cloth') || n.includes('wear') || n.includes('fashion') || n.includes('shirt') || n.includes('shoes')) return '👕';
  if (n.includes('tech') || n.includes('computer') || n.includes('phone') || n.includes('gadget') || n.includes('apple')) return '💻';
  if (n.includes('health') || n.includes('gym') || n.includes('doctor') || n.includes('fit') || n.includes('med')) return '🏋️';
  if (n.includes('travel') || n.includes('trip') || n.includes('flight') || n.includes('hotel') || n.includes('vacation')) return '✈️';
  if (n.includes('school') || n.includes('study') || n.includes('book') || n.includes('education') || n.includes('college')) return '📚';
  if (n.includes('gift') || n.includes('present') || n.includes('party')) return '🎁';
  if (n.includes('bike') || n.includes('motorcycle') || n.includes('cycling') || n.includes('karizma')) return '🏍️';
  if (n.includes('car') || n.includes('drive') || n.includes('transport') || n.includes('uber') || n.includes('taxi')) return '🚗';
  if (n.includes('home') || n.includes('rent') || n.includes('house') || n.includes('flat')) return '🏠';
  if (n.includes('money') || n.includes('cash') || n.includes('bank') || n.includes('invest') || n.includes('crypto')) return '💰';
  if (n.includes('movie') || n.includes('cinema') || n.includes('netflix') || n.includes('show') || n.includes('theater')) return '🎬';
  if (n.includes('music') || n.includes('song') || n.includes('spotify') || n.includes('concert') || n.includes('gig')) return '🎵';
  if (n.includes('pet') || n.includes('dog') || n.includes('cat')) return '🐾';
  if (n.includes('love') || n.includes('date')) return '❤️';
  if (n.includes('sub') || n.includes('monthly')) return '💳';
  return '🎯';
}

// export function formatDate(date: Date | string | undefined): string {
//   if (!date) return 'N/A';
//   const d = typeof date === 'string' ? new Date(date) : date;
//   return d.toLocaleDateString('es-ES', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// }

/**
 * Formatea un precio como moneda
 * @example formatCurrency('30', 'USD') → "$30.00"
 */
export function formatCurrency(
  amount: string | number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formatea una fecha
 * @example formatDate('2024-01-15') → "15 ene 2024"
 */
export function formatDate(
  date: Date | string | undefined | null,
  locale: string = 'es-ES'
): string {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(
  date: Date | string | undefined | null,
  locale: string = 'es-ES'
): string {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Calcula la fecha de próximo pago (1 mes desde hoy)
 */
export function getNextPaymentDate(from: Date = new Date()): string {
  const next = new Date(from);
  next.setMonth(next.getMonth() + 1);
  return next.toISOString();
}
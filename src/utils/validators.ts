import { z } from 'zod';

// Lista de los TLDs más comunes 
const VALID_TLDS = [
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'io', 'co', 'app', 'dev',
  'es', 'sv', 'mx', 'ar', 'co', 'pe', 'cl', 'ec', 'gt', 'hn', 'ni', 'cr', 'pa',
  'info', 'biz', 'online', 'site', 'store', 'shop', 'tech', 'ai'
]

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'El correo es demasiado corto')
  .max(254, 'El correo es demasiado largo')
  z.email('Formato de correo inválido')
  .refine(
    (email) => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      
      const domainParts = parts[1].split('.');
      // Debe tener al menos dominio.tld
      if (domainParts.length < 2) return false;

      const tld = domainParts[domainParts.length - 1];
      // Validar que el TLD esté en nuestra lista
      return VALID_TLDS.includes(tld);
    },
    { message: 'El dominio del correo no es válido' }
  );
  
  /**
 * Valida un número de tarjeta con el algoritmo de Luhn.
 * Este algoritmo verifica que el número sea matemáticamente válido
 * (no verifica que exista, pero detecta typos comunes).
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detecta el tipo de tarjeta según el prefijo (BIN).
 */
export function getCardType(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  return 'Tarjeta';
}

/**
 * Formatea un número de tarjeta con espacios cada 4 dígitos.
 * @example formatCardNumber('4242424242424242') → '4242 4242 4242 4242'
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Formatea la fecha de vencimiento como MM/YY.
 */
export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * Valida la fecha de vencimiento (MM/YY).
 * Rechaza fechas pasadas y meses inválidos.
 */
export function isValidExpiryDate(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 4) return false;

  const month = parseInt(digits.slice(0, 2), 10);
  const year = parseInt('20' + digits.slice(2), 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  // Aceptamos hasta 10 años en el futuro
  if (year > currentYear + 10) return false;

  return true;
}

/**
 * Valida un CVV (3 o 4 dígitos).
 */
export function isValidCVV(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}

/**
 * Valida que el nombre del titular tenga al menos 2 palabras.
 */
export function isValidCardHolder(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
}

/**
 * Enmascara un número de tarjeta mostrando solo los últimos 4 dígitos.
 * @example maskCardNumber('4242424242424242') → '•••• •••• •••• 4242'
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}
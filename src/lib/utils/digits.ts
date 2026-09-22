/**
 * Persian (۰-۹) and Arabic-Indic (٠-٩) digits typed on a Persian keyboard are
 * not what the API or `Number()` expect, so every numeric field normalises to
 * ASCII before the value is used.
 */
export function toEnglishDigits(str: string): string {
  return String(str ?? '')
    .replace(/[۰-۹]/g, (ch) => String(ch.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (ch) => String(ch.charCodeAt(0) - 0x0660));
}

/** Same, but keeps only the digits — for phone numbers and OTP codes. */
export function digitsOnly(str: string): string {
  return toEnglishDigits(str).replace(/\D/g, '');
}

/**
 * Accepts the forms students actually type — 09123456789, 9123456789,
 * +98 912 345 6789, 0098… — and returns the local 09XXXXXXXXX form the API
 * expects. Anything else is returned as digits so validation can reject it.
 */
export function normalizeIranMobile(raw: string): string {
  let d = digitsOnly(raw);
  if (d.startsWith('0098')) d = `0${d.slice(4)}`;
  else if (d.startsWith('98') && d.length >= 12) d = `0${d.slice(2)}`;
  else if (d.startsWith('9') && d.length === 10) d = `0${d}`;
  return d.slice(0, 11);
}

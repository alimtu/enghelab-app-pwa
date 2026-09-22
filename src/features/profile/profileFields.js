import { digitsOnly, normalizeIranMobile } from '../../lib/utils/digits';
import { MOBILE_PATTERN } from '../../lib/auth/constants';

/** The backend writes "-" for "not provided", which should read as empty. */
export function isBlank(value) {
  const v = String(value ?? '').trim();
  return v === '' || v === '-';
}

/**
 * Issued by the university and permanent once set. The student may fill one in
 * while it is empty, but never edit it afterwards.
 */
export const IDENTITY_FIELDS = [
  {
    key: 'codem',
    label: 'کد ملی',
    dir: 'ltr',
    inputMode: 'numeric',
    maxLength: 10,
    normalize: digitsOnly,
    validate: (v) =>
      isValidNationalCode(v) ? null : 'کد ملی وارد شده معتبر نیست.',
  },
  {
    key: 'mobile',
    label: 'شماره موبایل',
    dir: 'ltr',
    inputMode: 'numeric',
    maxLength: 11,
    normalize: normalizeIranMobile,
    validate: (v) =>
      MOBILE_PATTERN.test(v) ? null : 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
  },
];

/** Contact details the student owns and can change whenever they like. */
export const CONTACT_FIELDS = [
  { key: 'fname', label: 'نام' },
  { key: 'lname', label: 'نام خانوادگی' },
  { key: 'email', label: 'ایمیل', dir: 'ltr', type: 'email' },
  { key: 'adr', label: 'آدرس', multiline: true },
];

/**
 * Iranian national code checksum. Worth enforcing because the value can only
 * ever be submitted once — a typo here is permanent.
 */
export function isValidNationalCode(raw) {
  const code = digitsOnly(raw);
  if (code.length !== 10) return false;
  // Repdigits (0000000000, 1111111111, …) satisfy the checksum but are invalid.
  if (/^(\d)\1{9}$/.test(code)) return false;

  const check = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split('')
    .reduce((acc, digit, i) => acc + Number(digit) * (10 - i), 0);
  const remainder = sum % 11;

  return remainder < 2 ? check === remainder : check === 11 - remainder;
}

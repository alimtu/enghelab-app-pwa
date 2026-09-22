import http from '../axios';
import { LOGIN_OP, VERIFY_OP } from './constants';

/**
 * The three auth calls, kept together so the UI never has to know the op names
 * or that the token rides on the envelope rather than inside `data`.
 *
 * All of them pass `_returnFullBody` because `finger` sits next to `success`,
 * not under `data`. A `success: false` body is rejected by the axios
 * interceptor, so callers only handle the happy path here and read the
 * backend's Persian message from the thrown ApiError.
 */

/** username + password → a ready-to-use session token. */
export async function loginWithPassword({ user, pass }) {
  const body = await http.get('/', {
    params: { op: LOGIN_OP, user, pass },
    _returnFullBody: true,
  });
  if (!body?.finger) throw new Error('پاسخ نامعتبر از سرور دریافت شد.');
  return body.finger;
}

/**
 * Sends an SMS code. The finger returned here is NOT a session yet — it only
 * identifies the pending attempt, so it is held in component state and never
 * written to localStorage.
 */
export async function requestOtp({ mobile }) {
  const body = await http.get('/', {
    params: { op: LOGIN_OP, mob: mobile },
    _returnFullBody: true,
  });
  if (!body?.finger) throw new Error('ارسال کد تایید ناموفق بود.');
  return body.finger;
}

/**
 * Exchanges the pending finger + SMS code for a session. The backend may hand
 * back a fresh finger or simply confirm the pending one, so both are handled.
 */
export async function verifyOtp({ finger, code }) {
  const body = await http.get('/', {
    params: { op: VERIFY_OP, finger, code },
    _returnFullBody: true,
  });
  return body?.finger || finger;
}

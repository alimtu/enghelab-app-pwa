// The backend calls the session token a "finger"; it is stored in localStorage
// and attached to every request by the axios interceptor.
export const AUTH_TOKEN_KEY = 'finger';

// One backend op serves both sign-in methods:
//   • username + password →  op=m_login&user=…&pass=…   → returns the session finger
//   • mobile number       →  op=m_login&mob=09…         → sends an SMS code and
//                                                         returns a PRE-verification
//                                                         finger, which is then
//                                                         exchanged via m_verify.
// Anything it does not recognise comes back as the generic
// «خطای ارسال اطلاعات کاربری!», so failures cannot be told apart by message.
export const LOGIN_OP = 'm_login';

// Exchanges a pre-verification finger + the SMS code for a real session.
export const VERIFY_OP = 'm_verify';

// Length of the SMS code the backend sends.
export const OTP_LENGTH = 5;

// How long before the student may request another code.
export const OTP_RESEND_SECONDS = 120;

// Iranian mobile numbers, normalised to ASCII digits first.
export const MOBILE_PATTERN = /^09\d{9}$/;

// Where students without an account register. After registering there they come
// back and sign in here.
export const REGISTER_URL = 'https://feham.itcuir.ir/';

// Password recovery on the same Feham system.
export const FORGOT_PASSWORD_URL = 'https://feham.itcuir.ir/?sign=forget_pass';

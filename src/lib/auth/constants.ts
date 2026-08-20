// The backend calls the session token a "finger"; it is stored in localStorage
// and attached to every request by the axios interceptor.
export const AUTH_TOKEN_KEY = 'finger';

// Backend op used to exchange a username + password for an auth token.
// The Icms JSON API currently only documents OTP login (m_login / m_verify by
// mobile); no username/password op was discoverable by probing. Point this at
// the real password-login op once the backend exposes one — the login form and
// the axios interceptor both read it from here, so wiring is a one-line change.
export const LOGIN_OP = 'm_login';

// Where students without an account register. After registering there they come
// back and sign in here.
export const REGISTER_URL = 'https://feham.itcuir.ir/';

// Password recovery on the same Feham system.
export const FORGOT_PASSWORD_URL = 'https://feham.itcuir.ir/?sign=forget_pass';

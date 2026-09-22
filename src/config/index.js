module.exports = {
  app_name: 'enghelab-app',
  manifest: {
    version: '1.0.0',
  },
  isDebug: process.env.IS_DEBUG || false,
  api: {
    // The browser talks to the backend directly. Its certificate is valid and
    // it answers with `Access-Control-Allow-Origin: *`, so the reverse proxy
    // that used to terminate a bad upstream cert is no longer needed.
    baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://feham.itcuir.ir/').replace(
      /\/$/,
      ''
    ),
    soketiUrl: process.env.NUXT_ENV_SOKETI_PUSHER_HOST,
    soketiPort: process.env.NUXT_ENV_SOKETI_PUSHER_PORT || 80,
    soketiAppKey: process.env.NUXT_ENV_SOKETI_PUSHER_APP_KEY,
    soketiAuthUrl: process.env.NUXT_ENV_SOKETI_AUTH_URL,
    browserBaseURL: null,
    proxy: false,
  },
  media: {
    baseUrl: process.env.MEDIA_BASE_URL || process.env.API_BASE_URL || '',
  },
  site: {
    baseUrl: (
      process.env.BASE_URL || 'http://localhost:' + (process.env.NUXT_PORT || '3000') + '/'
    ).replace(/\/$/, ''),
  },
  gtm: {
    id: process.env.NUXT_ENV_GTM_ID,
  },
};

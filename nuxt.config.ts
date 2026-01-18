// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', flag: '🇬🇧', file: 'en.json' },
      { code: 'zh-CN', name: '简体中文', flag: '🇨🇳', file: 'zh-CN.json' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪', file: 'de.json' }
      // { code: 'en-US', name: 'US English', flag: '🇺🇸', file: 'en.json' },
      // { code: 'cs', name: 'Čeština', flag: '🇨🇿', file: 'en.json' },
      // { code: 'da', name: 'Dansk', flag: '🇩🇰', file: 'en.json' },
      // { code: 'es', name: 'Español', flag: '🇪🇸', file: 'en.json' },
      // { code: 'fr', name: 'Français', flag: '🇫🇷', file: 'en.json' },
      // { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', file: 'en.json' },
      // { code: 'it', name: 'Italiano', flag: '🇮🇹', file: 'en.json' },
      // { code: 'ja', name: '日本語', flag: '🇯🇵', file: 'en.json' },
      // { code: 'nl', name: 'Nederlands', flag: '🇳🇱', file: 'en.json' },
      // { code: 'no', name: 'Norsk', flag: '🇳🇴', file: 'en.json' },
      // { code: 'is', name: 'Íslenskur', flag: '🇮🇸', file: 'en.json' },
      // { code: 'pt', name: 'Português', flag: '🇵🇹', file: 'en.json' },
      // { code: 'sv', name: 'Svenska', flag: '🇸🇪', file: 'en.json' },
      // { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', file: 'zh-CN.json' }
    ],
    compilation: {
      strictMessage: false
    },
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  css: ['~/assets/css/main.css'],

  // Ensure UI module is properly configured
  app: {
    head: {
      title: 'Marathon Photos Live'
    }
  }
})
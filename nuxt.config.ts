// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'en-US', name: 'US English', flag: '🇺🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'no', name: 'Norsk', flag: '🇳🇴' },
      { code: 'is', name: 'Íslenskur', flag: '🇮🇸' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
      { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
      { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' }
    ],
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
  ui: {
    global: true
  }
})
// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/strapi',
    'shadcn-nuxt'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  shadcn: {
    /**
         * Prefix for all the imported component
         */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  ssr: true,
  target: 'static',
  runtimeConfig: {
    public: {
      strapiURL: 'http://localhost:1337/api'
    }
  }
})
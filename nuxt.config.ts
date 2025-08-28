import { URL, fileURLToPath } from 'url';
import svgLoader from 'vite-svg-loader';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  srcDir: 'app/',

  app: {
    baseURL: process.env.BASE_URL,
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'MetadataPRO - Music Metadata Validation',
      meta: [
        {
          name: 'description',
          content: 'Stop losing money to poor metadata. Professional validation and correction for independent artists, labels, and venues. Prevent distribution rejections and maximize royalty collection.'
        },
        {
          name: 'keywords',
          content: 'music metadata, ISRC codes, distribution validation, music royalties, DistroKid, CD Baby, TuneCore, music publishing, PRO registration'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: 'MetadataPRO'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'theme-color',
          content: '#3b82f6'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        }
      ],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/supabase'
  ],

  css: [
    '~/app/assets/style/tailwind.css'
  ],

  vite: {
    plugins: [
      svgLoader(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    assetsInclude: ['**/*.mdx'],
    css: {
      preprocessorOptions: {
        sass: { api: 'modern' },
        scss: { api: 'modern' },
      },
    },
  },

  devtools: {
    enabled: true,
  },

  devServer: {
    port: 8080,
    host: 'localhost',
  },

  routeRules: {
    '/': { prerender: true },
    '/vip': { ssr: true },
    '/vip/thank-you': { ssr: true },
    '/dashboard/**': { ssr: false },
    '/auth/**': { ssr: true },
    '/api/**': { cors: true }
  },

  supabase: {
    redirectOptions: {
      login: '/auth/user-login',
      callback: '/auth/confirm-email',
      exclude: ['/', '/vip', '/vip/thank-you', '/auth/user-login', '/auth/user-signup', '/auth/confirm-email', '/auth/forgot-password', '/auth/reset-password']
    }
  },

  // Build optimization - ENHANCED
  build: {
    transpile: ['@headlessui/vue']
  },

  runtimeConfig: {
    // NOTE: runtime-config is for demo purposes - more information about how to handle these can be found within the nuxt docs of course: https://nuxt.com/docs/guide/going-further/runtime-config#example - also pay attention to the naming conventions to take fully profit.
    apiSecret: '', // can be overridden by NUXT_API_SECRET environment variable
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    public: {
      apiBase: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    }
  },

  ssr: true,

  nitro: {
    preset: 'vercel', // TODO update depending on hosting
    compressPublicAssets: true
  },

  experimental: {
    payloadExtraction: false
  },

  compatibilityDate: '2024-12-05',
});
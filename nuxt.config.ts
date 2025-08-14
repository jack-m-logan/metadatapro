import { URL, fileURLToPath } from 'url';
import svgLoader from 'vite-svg-loader';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL,
    head: {
      title: 'metaPRO',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/supabase'
  ],

  css: [
    '~/app/assets/style/animations.scss',
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
        // Use sass
        sass: { api: 'modern' },
        // Or use scss
        scss: { api: 'modern' },
      },
    },
  },

	devtools: {
		enabled: true,
	},

  runtimeConfig: {
    // NOTE: runtime-config is for demo purposes - more information about how to handle these can be found within the nuxt docs of course: https://nuxt.com/docs/guide/going-further/runtime-config#example - also pay attention to the naming conventions to take fully profit.
    apiSecret: '', // can be overridden by NUXT_API_SECRET environment variable
    public: {
      apiBase: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },

  devServer: {
    port: 8080,
    host: 'localhost',
  },

  supabase: {
    redirectOptions: {
      login: '/auth/user-login',
      callback: '/auth/confirm-email',
      exclude: ['/', '/auth/user-login', '/auth/user-signup', '/auth/confirm-email', '/auth/forgot-password', '/auth/reset-password']
    }
  },

  runtimeConfig: {
    supabase: {
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    }
  },

  compatibilityDate: '2024-12-05',
});

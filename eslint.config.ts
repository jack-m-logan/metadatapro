import eslint from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: [
      'node_modules',
      'coverage',
      'dist',
      '.output',
      '.nuxt',
      '.yarn',
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.vue,
        ref: 'readonly',
        computed: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        navigateTo: 'readonly',
        useNuxtApp: 'readonly',
      },
      parserOptions: {
        parser: typescriptEslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'vue/multi-word-component-names': [
        'error',
        { ignores: ['index','demo','default','error','[id]'] }
      ],
    },
  },
  {
    files: ['nuxt.config.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
);
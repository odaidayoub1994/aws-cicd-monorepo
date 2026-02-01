// @ts-check
import nestjsConfig from '@aws-cicd-monorepo/eslint-config/nestjs';

export default [
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'test/**'],
  },
  ...nestjsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

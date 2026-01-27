// @ts-check
import eslint from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  eslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'warn',
    },
  },
];

export default baseConfig;

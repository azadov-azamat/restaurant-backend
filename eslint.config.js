const js = require('@eslint/js');
const n = require('eslint-plugin-n');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.next',
      'coverage',
      'db/seeders',
      'db/migrations',
      'front',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      n: require('eslint-plugin-n'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      ...js.configs.recommended.rules,
      ...n.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
];

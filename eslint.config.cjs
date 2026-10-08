const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const typescriptParser = require('@typescript-eslint/parser');
const { configs } = require('angular-eslint');

module.exports = [
  { ignores: ['projects/**', 'dist/**', 'coverage/**', '.angular/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { '@angular-eslint': angular },
    processor: angularTemplate.processors['extract-inline-html'],
    rules: {
      ...Object.assign({}, ...configs.tsRecommended.map(config => config.rules)),
      // Existing Ionic pages retain Eager change detection during the migration.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Page', 'Component'] }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': angularTemplate },
    rules: { ...Object.assign({}, ...configs.templateRecommended.map(config => config.rules)) },
  },
];

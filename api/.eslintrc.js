module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json',], },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': [
      'error',
      2
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/object-curly-spacing': [
      'error',
      'always'
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single'
    ],
    'array-bracket-newline': [
      'error',
      {
        'multiline': true,
        'minItems': 2
      }
    ],
    'array-element-newline': [
      'error',
      'always'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'indent': 'off',
    'max-len': [
      'error',
      140
    ],
    'no-multiple-empty-lines': [
      'error',
      { max: 1 }
    ],
    'no-trailing-spaces': [
      'error',
      { 'ignoreComments': true }
    ],
    'object-curly-newline': [
      'error',
      { 'minProperties': 2 }
    ],
    'object-curly-spacing': 'off',
    'object-property-newline': ['error'],
    'quotes': 'off',
    'semi': [
      'error',
      'always'
    ],
  },
};

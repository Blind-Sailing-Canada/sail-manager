module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/indent': ['error', 2],
    'indent': [
      'error',
      2,
      {
        "SwitchCase": 1
      }
    ],
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],
    'semi': ['error', 'always'],
    'object-curly-newline': ['error', { 'minProperties': 2 }],
    'object-property-newline': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'array-element-newline': ['error','always'],
    'array-bracket-newline': ['error', { 'multiline': true, 'minItems': 2 }],
    'no-trailing-spaces': ['error', { 'ignoreComments': true }],
    'max-len': ['error', 140]
  },
};

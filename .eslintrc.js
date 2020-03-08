module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 4],
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'no-throw-literal': 'off',
    quotes: ["error", "double"],
  },
};


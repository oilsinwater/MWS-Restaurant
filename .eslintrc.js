module.exports = {
  env: {
    //"extends": "google"
    browser: true,
    commonjs: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['warn', 'single'],
    indent: ['warn', 2],
    'no-useless-escape': 'warn',
    'no-undef': 'warn',
    'no-useless-return': 'warn',
    'no-unused-vars': 'warn'
  }
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    camelcase: ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'object-curly-newline': ['off'],
    'arrow-body-style': ['off'],
    'prefer-destructuring': ['off'],
    'no-underscore-dangle': ['off'],
  },
};

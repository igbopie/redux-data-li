module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true
    },
    env: {
      es6: true
    }
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'vars-on-top': 'error',
    'prefer-const': 'error',
    'one-var': ['error', 'never'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    semi: ['error', 'always'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'eol-last': ['error', 'always'],
    'no-var': ['error'],
    'block-scoped-var': ['error'],
    eqeqeq: ['error'],
    complexity: ['error', 30],
    curly: ['error'],
    'dot-notation': ['error'],
    'no-implicit-globals': ['error'],
    'no-multi-spaces': ['error'],
    'no-new': ['error'],
    'no-new-func': ['error'],
    'no-new-wrappers': ['error'],
    'no-param-reassign': ['error'],
    'no-return-assign': ['error'],
    'no-self-compare': ['error'],
    'no-sequences': ['error'],
    'no-unused-expressions': ['error'],
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'no-trailing-spaces': ['error'],
    'no-undef': ['error']
  },
  globals: {
    Promise: true
  },
  plugins: [
    "jsdoc"
  ]
};

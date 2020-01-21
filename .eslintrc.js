module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "no-bitwise": 2,
    "no-cond-assign": 0,
    "curly": 2,
    "no-debugger": 0,
    "eqeqeq": 2,
    "no-eq-null": 0,
    "no-eval": 0,
    "guard-for-in": 2,
    "wrap-iife": 0,
    "comma-style": [
      2,
      "last"
    ],
    "max-depth": [
      2,
      9
    ],
    "max-params": [
      2,
      6
    ],
    "new-cap": 2,
    "no-caller": 2,
    "no-console": 0,
    "no-sequences": 2,
    "no-empty": 0,
    "no-new": 0,
    "no-plusplus": 0,
    "no-undef": 2,
    "no-unused-vars": [2, {"vars": "all", "args": "none"}],
    "dot-notation": 0,
    "strict": 0,
    "ember/no-restricted-resolver-tests": 0,
    "ember/no-observers": 0
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }
  ]
};

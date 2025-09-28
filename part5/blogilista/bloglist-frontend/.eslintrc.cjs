module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: { 
    react: { 
      version: '18.2',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
  },
}
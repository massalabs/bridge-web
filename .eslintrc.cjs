module.exports = {
  extends: ['@massalabs', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['html', '@tanstack/query'],
  rules: {
    'no-console': [
      'warn',
      { allow: ['log', 'clear', 'info', 'error', 'dir', 'trace'] },
    ],
  },
};

module.exports = {
  extends: ['@massalabs', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  plugins: ['html', '@tanstack/query', 'import'],
  rules: {
    'no-console': [
      'warn',
      { allow: ['log', 'clear', 'info', 'error', 'dir', 'trace'] },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};

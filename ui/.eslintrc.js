module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jsx-a11y/strict',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@next/next/no-img-element': 'off',
    'no-console': ['error', { allow: ['error', 'info'] }],
    'react-hooks/exhaustive-deps': 'off',
    'no-debugger': 'error',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/no-static-element-interactions': 'off', // Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element
    'jsx-a11y/click-events-have-key-events': 'off', // Visible, non-interactive elements with click handlers must have at least one keyboard listener
    'jsx-a11y/no-noninteractive-element-interactions': 'off', // Non-interactive elements should not be assigned mouse or keyboard event listeners
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'jsx-a11y/label-has-associated-control': 'off', // A form label must be associated with a control
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/img-redundant-alt': 'warn',
    'jsx-a11y/anchor-has-content': 'warn',
    'jsx-a11y/no-autofocus': 'off', // The autoFocus prop should not be used, as it can reduce usability and accessibility for users
    'jsx-a11y/iframe-has-title': 'warn',
    'jsx-a11y/anchor-is-valid': 0,
    // 'sonarjs/cognitive-complexity': 'warn',
  },
  // plugins: ['sonarjs'],
};

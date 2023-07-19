// Should match tailwind.config.js
export enum Color {
  primaryBlack = '#010101',
  primaryWhite = '#FFFFFF',
  primaryGray = '#6B7280',
  lightGray = '#D0D4DB',
  primaryBlue = '#025AA1',
  primaryBeige = '#F1EDE9',
  primaryRed = '#BF1B15',
}

// Useful for cases when using class names isn't convenient
// such as in svg fills
export function classNameToColor(className: string) {
  switch (className) {
    case 'dark:bg-black':
      return Color.primaryBlue;
    case 'light:bg-white':
      return Color.primaryRed;
    default:
      throw new Error('Missing color for className: ' + className);
  }
}

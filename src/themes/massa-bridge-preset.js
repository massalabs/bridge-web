/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import {
  colorGreen,
  colorWhite,
  colorDarkGrey,
  colorLightGrey,
  colorDarkBlue,
  colorDeepBlue,
  colorBasicBlue,
  colorGradientDarkBlue,
  colorGradientLightBlue,
  colorGradientLightTestnet,
  colorLightBlue,
  colorWarning,
  colorError,
  colorInfo,
} from './bridgeColors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createThemes } = require('tw-colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      Urbane: ['Urbane', 'sans-serif'],
      Poppins: ['Poppins', 'sans-serif'],
    },
  },
  plugins: [
    createThemes({
      light: {
        primary: colorWhite,
        secondary: colorLightGrey,
        tertiary: colorDarkGrey,
        brand: colorInfo,
        neutral: colorDarkBlue,
        info: colorLightBlue,
        'deep-blue': colorWhite,
        'bright-blue': colorGradientLightBlue,
        // states:
        's-success': colorGreen,
        's-error': colorError,
        's-warning': colorWarning,
        's-info': colorDarkGrey,
        's-info-1': colorInfo,
        // components:
        'c-default': colorDarkBlue,
        'c-hover': colorLightBlue,
        'c-pressed': colorBasicBlue,
        'c-disabled-1': colorDarkGrey,
        'c-disabled-2': colorLightGrey,
        'c-error': colorError,
        // icons:
        'i-primary': colorDarkBlue,
        'i-secondary': colorWhite,
        'i-tertiary': colorGreen,
        // fonts:
        'f-primary': colorDarkBlue,
        'f-secondary': colorWhite,
        'f-tertiary': colorGreen,
        'f-disabled-1': colorDarkGrey,
        'f-disabled-2': colorWhite,
      },
      'light-testnet': {
        primary: colorWhite,
        secondary: colorLightGrey,
        tertiary: colorDarkGrey,
        brand: colorDarkBlue, // changed
        neutral: colorDarkBlue,
        info: colorLightBlue,
        'deep-blue': colorWhite,
        'bright-blue': colorGradientLightTestnet, // changed
        // states:
        's-success': colorGreen,
        's-error': colorError,
        's-warning': colorWarning,
        's-info': colorDarkGrey,
        's-info-1': colorInfo,
        // components:
        'c-default': colorDarkBlue,
        'c-hover': colorLightBlue,
        'c-pressed': colorBasicBlue,
        'c-disabled-1': colorDarkGrey,
        'c-disabled-2': colorLightGrey,
        'c-error': colorError,
        // icons:
        'i-primary': colorDarkBlue,
        'i-secondary': colorWhite,
        'i-tertiary': colorGreen,
        // fonts:
        'f-primary': colorDarkBlue,
        'f-secondary': colorWhite,
        'f-tertiary': colorGreen,
        'f-disabled-1': colorDarkGrey,
        'f-disabled-2': colorWhite,
      },
      dark: {
        primary: colorDarkBlue,
        secondary: colorBasicBlue,
        tertiary: colorLightBlue,
        brand: colorInfo,
        neutral: colorWhite,
        info: colorDarkGrey,
        'deep-blue': colorDeepBlue,
        'bright-blue': colorGradientDarkBlue,
        // states:
        's-success': colorGreen,
        's-error': colorError,
        's-warning': colorWarning,
        's-info': colorDarkGrey,
        's-info-1': colorInfo,
        // components:
        'c-default': colorWhite,
        'c-hover': colorDarkGrey,
        'c-pressed': colorLightGrey,
        'c-disabled-1': colorDarkGrey,
        'c-disabled-2': colorLightGrey,
        'c-error': colorError,
        // icons:
        'i-primary': colorWhite,
        'i-secondary': colorDarkBlue,
        'i-tertiary': colorGreen,
        // fonts:
        'f-primary': colorWhite,
        'f-secondary': colorDarkBlue,
        'f-tertiary': colorGreen,
        'f-disabled-1': colorDarkGrey,
        'f-disabled-2': colorWhite,
      },
      'dark-testnet': {
        primary: colorDarkBlue,
        secondary: colorBasicBlue,
        tertiary: colorLightBlue,
        brand: colorWhite, // changed
        neutral: colorWhite,
        info: colorDarkGrey,
        'deep-blue': colorDeepBlue,
        'bright-blue': colorWhite, // changed
        // states:
        's-success': colorGreen,
        's-error': colorError,
        's-warning': colorWarning,
        's-info': colorDarkGrey,
        's-info-1': colorInfo,
        // components:
        'c-default': colorWhite,
        'c-hover': colorDarkGrey,
        'c-pressed': colorLightGrey,
        'c-disabled-1': colorDarkGrey,
        'c-disabled-2': colorLightGrey,
        'c-error': colorError,
        // icons:
        'i-primary': colorWhite,
        'i-secondary': colorDarkBlue,
        'i-tertiary': colorGreen,
        // fonts:
        'f-primary': colorWhite,
        'f-secondary': colorDarkBlue,
        'f-tertiary': colorGreen,
        'f-disabled-1': colorDarkGrey,
        'f-disabled-2': colorWhite,
      },
    }),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.mas-banner': {
          fontSize: '36px',
          fontWeight: '600',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '44px',
          fontStyle: 'normal',
        },
        '.mas-title': {
          fontSize: '34px',
          fontWeight: '600',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '40px',
        },
        '.mas-subtitle': {
          fontSize: '20px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '24px',
        },
        '.mas-h2': {
          fontSize: '20px',
          fontWeight: '300',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '24px',
        },
        '.mas-h3': {
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '16px',
        },
        '.mas-buttons': {
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '20px',
        },
        '.mas-menu-active': {
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '20px',
        },
        '.mas-menu-default': {
          fontSize: '16px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '20px',
        },
        '.mas-menu-underline': {
          fontSize: '16px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Urbane'),
          lineHeight: '20px',
          textDecoration: 'underline',
          fontStyle: 'normal',
        },
        '.mas-body': {
          fontSize: '16px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Poppins'),
          lineHeight: '24px',
          fontStyle: 'normal',
        },
        '.mas-body2': {
          fontSize: '14px',
          fontWeight: '400',
          fontFamily: theme('fontFamily.Poppins'),
          lineHeight: '20px',
        },
        '.mas-caption': {
          fontSize: '12px',
          fontWeight: '400',
          fontFamily: theme('fontFamily.Poppins'),
          lineHeight: '16px',
        },
      });
    }),
  ],
};

import '@inrupt/jest-jsdom-polyfills'; // to fix "ReferenceError: TextEncoder is not defined"

// to fix "ReferenceError: jest is not defined":
import { jest } from '@jest/globals';
global.jest = jest;

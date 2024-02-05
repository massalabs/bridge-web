import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'jsdom', // use jsdom to fix "ReferenceError: window is not defined"
  // .ts and .tsx so that jest can process ui-kit .tsx files,
  // and fix "Must use import to load ES Module":
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1', // so that jest can resolve @/components/xxx
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform',
  },
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.[jt]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.ts'], // see file jest.setup.ts
};

export default jestConfig;

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  coverageProvider: 'v8',
  coverageReporters: [
    'html-spa',
    'clover'
  ],
  errorOnDeprecated: true,
  modulePaths: [
    'node_modules'
  ],
  testMatch: [
    '**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
};

export default config;

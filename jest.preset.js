const { readFileSync } = require('fs');
const path = require('path');
const nxPreset = require('@nx/jest/preset').default;

const { exclude: _, ...swcJestConfig } = JSON.parse(
  readFileSync(path.resolve(__dirname, `workspace-configs/lib/.swcrc`), 'utf-8')
);

module.exports = {
  ...nxPreset,
  resetMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  clearMocks: true,
  coverageReporters: ['text', 'html', 'lcov'],
  reporters: ['default', 'jest-slow-test-reporter'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__generated__/', 'index.ts'],
  moduleFileExtensions: [
    ...nxPreset.moduleFileExtensions,
    'jsx',
    'tsx',
    'json',
    'js',
    'jsx',
    'node',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcJestConfig],
  },
  globalSetup: path.resolve(__dirname, 'global-setup.js'),
  transformIgnorePatterns: ['/node_modules/(?!(flag-icons|axios)/)'],
};

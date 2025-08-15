module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/tests/**/*.test.ts',
    '**/*.unit.test.ts',
    '**/*.integration.test.ts',
    '**/*.e2e.test.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/config/**',
  ],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // setupFilesAfterEnv: ['<rootDir>/tests/setup/globalSetup.ts'],
  // globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
  testTimeout: 30000,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};

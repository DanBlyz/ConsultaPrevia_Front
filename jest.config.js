module.exports = {
  rootDir: './',
  moduleDirectories: ['node_modules', './'],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/*.model.(t|j)s',
    '!src/**/*.module.(t|j)s',
    '!src/**/*.prod.(t|j)s',
    '!src/assets/**/*.*'
  ],
  coverageDirectory: '<rootDir>/coverage/jest',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup'
};

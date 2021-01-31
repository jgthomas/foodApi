module.exports = {
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageReporters: ['html', 'lcov', 'text'],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.js'],
};

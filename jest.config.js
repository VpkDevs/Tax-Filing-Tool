module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/mocks/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/js/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/js/setup.js'],
  collectCoverage: false,
  collectCoverageFrom: ['src/static/js/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  transformIgnorePatterns: [
    '/node_modules/(?!punycode)/',
  ],
};

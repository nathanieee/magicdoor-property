module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/server/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/tests/**',
    '!server/config/**',
    '!server/seedData/**'
  ],
  verbose: true
};

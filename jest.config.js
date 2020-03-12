module.exports = {
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/data/',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};

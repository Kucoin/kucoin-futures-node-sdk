module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    window: true,
    'ts-jest': {
      isolatedModules: true,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  testRegex: '^.+\\.test\\.(js|ts)$',
  moduleFileExtensions: ['js', 'ts'],
};

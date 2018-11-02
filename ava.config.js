export default {
  cache: true,
  concurrency: 5,
  failFast: true,
  failWithoutAssertions: true,
  verbose: true,
  files: [
    'src/*.test.js',
  ],
  require: [
    '@babel/register',
  ],
};

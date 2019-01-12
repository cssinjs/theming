module.exports = {
  presets: [
    ['@babel/env', { loose: true }],
    '@babel/react',
    '@babel/flow',
  ],
  plugins: ['@babel/proposal-class-properties', 'dev-expression'],
};

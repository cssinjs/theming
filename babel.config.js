module.exports = {
  presets: [
    ['@babel/env', { loose: true }],
    '@babel/react',
    '@babel/typescript',
  ],
  plugins: ['@babel/proposal-class-properties', 'dev-expression'],
};

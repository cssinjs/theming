const createThemeProvider = require('./create-theme-provider');
const createWithTheme = require('./create-with-theme');
const channel = require('./channel');

module.exports = {
  ThemeProvider: createThemeProvider(),
  withTheme: createWithTheme(),
  channel,
  createThemeProvider,
  createWithTheme,
  create: (customChannel = channel) => ({
    ThemeProvider: createThemeProvider(customChannel),
    withTheme: createWithTheme(customChannel),
  }),
};

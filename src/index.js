const createThemeProvider = require('./create-theme-provider');
const createWithTheme = require('./create-with-theme');
const channel = require('./channel');

module.exports = {
  ThemeProvider: createThemeProvider(channel),
  withTheme: createWithTheme(channel),
  channel,
  createThemeProvider,
  createWithTheme,
};

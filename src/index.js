const createThemeProvider = require('./create-theme-provider');
const createWithTheme = require('./create-with-theme');
const channel = require('./channel');

module.exports = {
  withTheme: createWithTheme(),
  ThemeProvider: createThemeProvider(),
  channel,
  createTheming: (customChannel = channel) => ({
    withTheme: createWithTheme(customChannel),
    ThemeProvider: createThemeProvider(customChannel),
  }),
};

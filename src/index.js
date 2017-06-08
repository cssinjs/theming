const createThemeProvider = require('./create-theme-provider');
const createWithTheme = require('./create-with-theme');
const channel = require('./channel');

module.exports = {
  channel,
  withTheme: createWithTheme(),
  ThemeProvider: createThemeProvider(),
  createTheming: (customChannel = channel) => ({
    channel: customChannel,
    withTheme: createWithTheme(customChannel),
    ThemeProvider: createThemeProvider(customChannel),
  }),
};

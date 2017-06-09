import createThemeProvider from './create-theme-provider';
import createWithTheme from './create-with-theme';
import channel from './channel';

export { default as channel } from './channel';
export const withTheme = createWithTheme();
export const ThemeProvider = createThemeProvider();
export const createTheming = (customChannel = channel) => ({
  channel: customChannel,
  withTheme: createWithTheme(customChannel),
  ThemeProvider: createThemeProvider(customChannel),
});

import createThemeProvider from './create-theme-provider';
import createWithTheme from './create-with-theme';
import defaultChannel from './channel';

export const channel = defaultChannel;
export const withTheme = createWithTheme();
export const ThemeProvider = createThemeProvider();
export function createTheming(customChannel = defaultChannel) {
  return {
    channel: customChannel,
    withTheme: createWithTheme(customChannel),
    ThemeProvider: createThemeProvider(customChannel),
  };
}

export default {
  channel: defaultChannel,
  withTheme,
  ThemeProvider,
  createTheming,
};

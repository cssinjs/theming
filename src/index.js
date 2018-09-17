
import createReactContext from 'create-react-context';

import createThemeProvider from './create-theme-provider';
import createWithTheme from './create-with-theme';

function createTheming(defaultTheme = {}) {
  const context = createReactContext(defaultTheme);

  return {
    withTheme: createWithTheme(context),
    ThemeProvider: createThemeProvider(context),
  };
}

const {
  withTheme,
  ThemeProvider,
} = createTheming();

export {
  withTheme,
  createTheming,
  ThemeProvider,
};

export default {
  withTheme,
  ThemeProvider,
  createTheming,
};

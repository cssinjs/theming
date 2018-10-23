// @flow

import createReactContext, { type Context } from 'create-react-context';

import createThemeProvider from './create-theme-provider';
import createWithTheme from './create-with-theme';

const defaultContext = createReactContext({});

function createTheming(context: Context<{}>) {
  return {
    withTheme: createWithTheme(context),
    ThemeProvider: createThemeProvider(context),
  };
}

const {
  withTheme,
  ThemeProvider,
} = createTheming(defaultContext);

export {
  withTheme,
  createTheming,
  ThemeProvider,
};

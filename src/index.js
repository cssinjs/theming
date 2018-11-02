// @flow

import createReactContext, { type Context } from 'create-react-context';

import createThemeProvider from './create-theme-provider';
import createWithTheme from './create-with-theme';

type ExtractReturnType = <ReturnType>((context: Context<{}>) => ReturnType) => ReturnType;

interface Theming {
  withTheme: $Call<ExtractReturnType, typeof createWithTheme>,
  ThemeProvider: $Call<ExtractReturnType, typeof createThemeProvider>,
}

const ThemeContext = createReactContext<{}>({});

function createTheming(context: Context<{}>): Theming {
  return {
    withTheme: createWithTheme(context),
    ThemeProvider: createThemeProvider(context),
  };
}

const {
  withTheme,
  ThemeProvider,
} = createTheming(ThemeContext);

export type { Theming };

export {
  ThemeContext,
  withTheme,
  createTheming,
  ThemeProvider,
};

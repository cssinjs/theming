// @flow

import createReactContext, { type Context } from 'create-react-context';

import createThemeProvider, { type ThemeProviderProps } from './create-theme-provider';
import createWithTheme from './create-with-theme';

type ExtractReturnType<Theme> = <ReturnType>(
  (context: Context<Theme | null>) => ReturnType
) => ReturnType;

interface Theming<Theme> {
  context: Context<Theme | null>,
  withTheme: $Call<ExtractReturnType<Theme>, typeof createWithTheme>,
  ThemeProvider: $Call<ExtractReturnType<Theme>, typeof createThemeProvider>,
}

const ThemeContext = createReactContext<{} | null>(null);

function createTheming<Theme: {}>(context: Context<Theme | null>): Theming<Theme> {
  return {
    context,
    withTheme: createWithTheme(context),
    ThemeProvider: createThemeProvider(context),
  };
}

const {
  withTheme,
  ThemeProvider,
} = createTheming(ThemeContext);

export type {
  Theming,
  ThemeProviderProps,
};

export {
  ThemeContext,
  withTheme,
  createTheming,
  ThemeProvider,
};

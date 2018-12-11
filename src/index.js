// @flow

import { createContext, type Context } from 'react';

import createThemeProvider, { type ThemeProviderProps } from './create-theme-provider';
import createWithTheme from './create-with-theme';

type ExtractReturnType<Theme> = <ReturnType>(
  (context: Context<Theme>) => ReturnType
) => ReturnType;

interface Theming<Theme> {
  context: Context<Theme>,
  withTheme: $Call<ExtractReturnType<Theme>, typeof createWithTheme>,
  ThemeProvider: $Call<ExtractReturnType<Theme>, typeof createThemeProvider>,
}

const ThemeContext = createContext<{} | void>();

function createTheming<Theme>(context: Context<Theme>): Theming<Theme> {
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

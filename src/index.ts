import * as React from 'react'

import createThemeProvider, {ThemeProviderProps} from './create-theme-provider'
import createWithTheme from './create-with-theme'
import createUseTheme from './create-use-theme'

interface Theming<Theme> {
  context: React.Context<Theme>
  withTheme: ReturnType<typeof createWithTheme>
  ThemeProvider: ReturnType<typeof createThemeProvider>
  useTheme: ReturnType<typeof createUseTheme>
}

const ThemeContext = React.createContext<object>(null)

function createTheming<Theme extends object>(context: React.Context<Theme>): Theming<Theme> {
  return {
    context,
    withTheme: createWithTheme(context),
    useTheme: createUseTheme(context),
    ThemeProvider: createThemeProvider(context)
  }
}

const {withTheme, ThemeProvider, useTheme} = createTheming(ThemeContext)

export {
  Theming,
  ThemeProviderProps,
  useTheme,
  ThemeContext,
  withTheme,
  createTheming,
  ThemeProvider
}

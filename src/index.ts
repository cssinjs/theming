import * as React from 'react'

import createThemeProvider, {ThemeProviderProps} from './create-theme-provider'
import createWithTheme, {WithThemeFactory} from './create-with-theme'
import createUseTheme from './create-use-theme'

interface Theming<Theme> {
  context: React.Context<Theme>
  withTheme: WithThemeFactory<Theme>
  ThemeProvider: React.ComponentType<ThemeProviderProps<Theme>>
  useTheme: () => Theme
}

const ThemeContext = React.createContext<object>({})

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

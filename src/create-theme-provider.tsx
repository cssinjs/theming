import * as React from 'react'
import warning from 'tiny-warning'
import isObject from './is-object'
import createUseTheme from './create-use-theme'

export interface ThemeProviderProps<Theme extends {}> {
  children: React.ReactNode
  theme: Theme | ((outerTheme: Theme) => Theme)
}

export default function createThemeProvider<Theme extends object>(
  context: React.Context<Theme>
): React.ComponentType<ThemeProviderProps<Theme>> {
  const useTheme = createUseTheme(context)

  return function(props: ThemeProviderProps<Theme>) {
    const outerTheme = useTheme()

    const computedTheme = React.useMemo(() => {
      if (props.theme instanceof Function) {
        const theme = props.theme(outerTheme)

        warning(isObject(theme), '[ThemeProvider] Please return an object from your theme function')

        return theme
      }

      warning(isObject(props.theme), '[ThemeProvider] Please make your theme prop a plain object')

      return outerTheme ? {...outerTheme, ...props.theme} : props.theme
    }, [outerTheme, props.theme])

    return <context.Provider value={computedTheme}>{props.children}</context.Provider>
  }
}

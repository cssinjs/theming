import * as React from 'react'
import warning from 'tiny-warning'
import isObject from './is-object'

const createUseTheme = <Theme extends object>(context: React.Context<Theme>) => {
  const useTheme = () => {
    const theme = React.useContext(context)

    warning(isObject(theme), '[theming] Please use useTheme only with the ThemeProvider')

    return theme
  }

  return useTheme
}

export default createUseTheme

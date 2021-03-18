// @flow

import React, {type Context} from 'react'
import warning from 'tiny-warning'
import isObject from './is-object'

export default function createUseTheme<Theme>(context: Context<Theme>) {
  const useTheme = (defaultTheme: Theme = null) => {
    const theme = React.useContext(context)

    // Return default theme if not set in the context
    // This can be useful if a themed component might not be wrapped in a theme provider
    if (!isObject(theme) && isObject(defaultTheme)) {
      return defaultTheme;
    }

    warning(isObject(theme), '[theming] Please use useTheme only with the ThemeProvider')

    return theme
  }

  return useTheme
}

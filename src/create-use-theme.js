// @flow

import React, {type Context} from 'react'
import warning from 'tiny-warning'
import isObject from './is-object'

export default function createUseTheme<Theme>(context: Context<Theme>) {
  const useTheme = () => {
    const theme = React.useContext(context)

    warning(isObject(theme), '[theming] Please use useTheme only with the ThemeProvider')

    return theme
  }

  return useTheme
}

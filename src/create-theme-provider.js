// @flow

import React, {type Node, type Context} from 'react'
import warning from 'tiny-warning'
import PropTypes from 'prop-types'
import isObject from './is-object'

type ThemeFunction<Theme> = (outerTheme: Theme) => $NonMaybeType<Theme>

type ThemeOrThemeFunction<Theme> = $NonMaybeType<Theme> | ThemeFunction<Theme>

export type ThemeProviderProps<Theme> = {
  children: Node,
  theme: ThemeOrThemeFunction<Theme>
}

export default function createThemeProvider<Theme>(context: Context<Theme>) {
  class ThemeProvider extends React.Component<ThemeProviderProps<Theme>> {
    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    getTheme(outerTheme: Theme) {
      if (
        this.props.theme !== this.lastTheme ||
        outerTheme !== this.lastOuterTheme ||
        !this.cachedTheme
      ) {
        this.lastOuterTheme = outerTheme
        this.lastTheme = this.props.theme

        if (typeof this.lastTheme === 'function') {
          const theme: ThemeFunction<Theme> = (this.props.theme: any)
          this.cachedTheme = theme(outerTheme)

          warning(
            isObject(this.cachedTheme),
            '[ThemeProvider] Please return an object from your theme function'
          )
        } else {
          const theme: Theme = (this.props.theme: any)
          warning(isObject(theme), '[ThemeProvider] Please make your theme prop a plain object')

          this.cachedTheme = outerTheme ? {...outerTheme, ...theme} : theme
        }
      }

      return this.cachedTheme
    }

    cachedTheme: Theme

    lastOuterTheme: Theme

    lastTheme: ThemeOrThemeFunction<Theme>

    renderProvider = (outerTheme: Theme) => {
      const {children} = this.props

      return <context.Provider value={this.getTheme(outerTheme)}>{children}</context.Provider>
    }

    render() {
      const {children} = this.props

      if (!children) {
        return null
      }

      return <context.Consumer>{this.renderProvider}</context.Consumer>
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    ThemeProvider.propTypes = {
      // eslint-disable-next-line react/require-default-props
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired
    }
  }

  return ThemeProvider
}

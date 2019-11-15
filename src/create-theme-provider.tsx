import * as React from 'react'
import warning from 'tiny-warning'
import PropTypes from 'prop-types'
import isObject from './is-object'

export type ThemeProviderProps<Theme extends {}> = {
  children: Node
  theme: Theme | ((outerTheme: Theme) => Theme)
}

export default function createThemeProvider<Theme extends object>(context: React.Context<Theme>) {
  class ThemeProvider extends React.PureComponent<ThemeProviderProps<Theme>> {
    static propTypes = {
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired
    }

    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    private getTheme(outerTheme: Theme) {
      const {theme} = this.props

      if (theme instanceof Function) {
        const t = theme(outerTheme)

        warning(isObject(t), '[ThemeProvider] Please return an object from your theme function')

        return t
      }
      warning(isObject(theme), '[ThemeProvider] Please make your theme prop a plain object')

      return outerTheme ? {...outerTheme, ...theme} : theme
    }

    private renderProvider = (outerTheme: Theme) => {
      return (
        <context.Provider value={this.getTheme(outerTheme)}>{this.props.children}</context.Provider>
      )
    }

    public render() {
      if (!this.props.children) {
        return null
      }

      return <context.Consumer>{this.renderProvider}</context.Consumer>
    }
  }

  return ThemeProvider
}

import * as React from 'react'
import hoist from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'
import warning from 'tiny-warning'
import isObject from './is-object'

function createWithTheme<Theme extends object>(context: React.Context<Theme>) {
  function hoc<
    InnerProps,
    InnerComponent extends React.ComponentType<InnerProps>,
    OuterProps extends InnerProps & {theme?: Theme}
  >(Component: InnerComponent) {
    const withTheme = React.forwardRef<InnerComponent, OuterProps>((props, ref) => (
      <context.Consumer>
        {theme => {
          warning(isObject(theme), '[theming] Please use withTheme only with the ThemeProvider')

          return <Component theme={theme} ref={ref} {...props} />
        }}
      </context.Consumer>
    ))

    withTheme.displayName = `WithTheme(${getDisplayName(Component)})`

    hoist(withTheme, Component)

    return withTheme
  }

  return hoc
}

export default createWithTheme

// @flow

import React, { type ComponentType, type Context } from 'react';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import warning from 'tiny-warning';
import isObject from './is-object';

export default function createWithTheme<Theme>(context: Context<Theme>) {
  return function hoc<
    InnerProps,
    InnerComponent: ComponentType<InnerProps>,
    OuterProps: { ...InnerProps, theme?: $NonMaybeType<Theme> }
  >(Component: InnerComponent): ComponentType<OuterProps> {
    const withTheme = React.forwardRef((props, ref) => (
      <context.Consumer>
        {theme => {
          warning(
            isObject(theme),
            '[theming] Please use withTheme only with the ThemeProvider'
          );

          return <Component theme={theme} ref={ref} {...props} />;
        }}
      </context.Consumer>
    ));

    if (process.env.NODE_ENV !== 'production') {
      withTheme.displayName = `WithTheme(${getDisplayName(Component)})`;
    }

    hoist(withTheme, Component);

    return withTheme;
  };
}

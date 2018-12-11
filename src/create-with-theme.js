// @flow

import React, { type ComponentType, type Ref, type Context } from 'react';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import warning from 'warning';
import isObject from './is-object';

export default function createWithTheme<Theme>(context: Context<Theme>) {
  return function hoc<
    InnerProps: {},
    InnerComponent: ComponentType<InnerProps>,
    OuterProps: $Diff<InnerProps, { theme: Theme }> & { innerRef?: Ref<InnerComponent> },
  >(Component: InnerComponent): ComponentType<OuterProps> {
    function withTheme(props: OuterProps) {
      const { innerRef, ...otherProps } = props;

      return (
        <context.Consumer>
          {(theme) => {
            warning(isObject(theme), '[theming] Please use withTheme only with the ThemeProvider');

            return (
              <Component
                theme={theme}
                ref={innerRef}
                {...otherProps}
              />
            );
          }}
        </context.Consumer>
      );
    }

    withTheme.displayName = `WithTheme(${getDisplayName(Component)})`;

    hoist(withTheme, Component);

    return withTheme;
  };
}

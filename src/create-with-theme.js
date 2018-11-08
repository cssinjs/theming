// @flow

import React, { type ComponentType, type ElementRef } from 'react';
import { type Context } from 'create-react-context';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import warning from 'warning';

type OuterPropsType<InnerProps, InnerComponent, Theme> = $Diff<InnerProps, { theme: Theme }> & {
  theme?: Theme,
  innerRef?: (instance: ElementRef<InnerComponent> | null) => void
};
type InnerPropsType<Theme> = { theme: Theme };

export default function createWithTheme<Theme: {}>(context: Context<Theme | null>) {
  return function hoc<
    InnerProps: InnerPropsType<Theme>,
    InnerComponent: ComponentType<InnerProps>,
    OuterProps: OuterPropsType<InnerProps, InnerComponent, Theme>,
  >(Component: InnerComponent): ComponentType<OuterProps> {
    function withTheme(props: OuterProps) {
      const { innerRef, ...otherProps } = props;

      return (
        <context.Consumer>
          {(theme) => {
            warning('[theming] Please use withTheme only with the ThemeProvider');

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

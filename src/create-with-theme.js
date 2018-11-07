// @flow

import React, { type ComponentType, type ElementRef } from 'react';
import { type Context } from 'create-react-context';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

type OuterPropsType<InnerProps, InnerComponent, Theme> = $Diff<InnerProps, { theme: Theme }> & {
  theme?: Theme,
  innerRef?: (instance: ElementRef<InnerComponent> | null) => void
};
type InnerPropsType<Theme> = { theme: Theme };

const env = process.env.NODE_ENV;

export default function createWithTheme<Theme: {} | null>(context: Context<Theme>) {
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
            if (env !== 'production' && theme === null) {
              throw new Error('[theming] Please use withTheme only with the ThemeProvider');
            }

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

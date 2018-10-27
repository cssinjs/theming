// @flow

import React, { type ComponentType, type ElementRef } from 'react';
import { type Context } from 'create-react-context';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

type Options = { forwardInnerRef?: boolean };
type OuterPropsType<InnerProps, InnerComponent, Theme> = $Diff<InnerProps, { theme: Theme }> & {
  theme?: Theme,
  innerRef?: (instance: ElementRef<InnerComponent> | null) => void
};
type InnerPropsType<Theme> = { theme: Theme };

export default function createWithTheme<Theme: {}>(context: Context<Theme>) {
  return function hoc<
    InnerProps: InnerPropsType<Theme>,
    InnerComponent: ComponentType<InnerProps>,
    OuterProps: OuterPropsType<InnerProps, InnerComponent, Theme>,
  >(
    Component: InnerComponent,
    { forwardInnerRef = false }: Options = {},
  ): ComponentType<OuterProps> {
    function withTheme(props: OuterProps) {
      // $FlowFixMe
      const { innerRef, ...otherProps } = props;

      otherProps[forwardInnerRef ? 'innerRef' : 'ref'] = innerRef;

      return (
        <context.Consumer>
          {theme => (
            <Component
              theme={theme}
              {...otherProps}
            />
          )}
        </context.Consumer>
      );
    }

    withTheme.displayName = `WithTheme(${getDisplayName(Component)})`;

    hoist(withTheme, Component);

    return withTheme;
  };
}

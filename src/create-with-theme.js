// @flow

import React, { type ComponentType, type ElementRef } from 'react';
import { type Context } from 'create-react-context';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

type OuterPropsType<InnerProps, InnerComponent, Theme> = $Diff<InnerProps, { theme: Theme }> & {
  theme?: Theme,
  innerRef?:(instance: ElementRef<InnerComponent> | null) => void
};

export default function createWithTheme<Theme: {}>(context: Context<Theme>) {
  function hoc<
    InnerProps: { theme: Theme },
    InnerComponent: ComponentType<InnerProps>,
    OuterProps: OuterPropsType<InnerProps, InnerComponent, Theme>,
  >(Component: InnerComponent): ComponentType<OuterProps> {
    function withTheme(props: OuterProps) {
      const { innerRef, ...rest } = props;

      return (
        <context.Consumer>
          {theme => (
            <Component
              ref={innerRef}
              theme={theme}
              {...rest}
            />
          )}
        </context.Consumer>
      );
    }

    withTheme.displayName = `WithTheme(${getDisplayName(Component)})`;

    hoist(withTheme, Component);

    return withTheme;
  }

  return hoc;
}

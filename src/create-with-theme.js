// @flow

import React, { type ComponentType } from 'react';
import { type Context } from 'create-react-context';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export default function createWithTheme(context: Context<{}>) {
  function hoc<Props, Comp: ComponentType<Props>>(Component: Comp, propName: string = 'theme') {
    function withTheme(props: Props) {
      return (
        <context.Consumer>
          {theme => (
            <Component
              {...{ [propName]: theme }}
              {...props}
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

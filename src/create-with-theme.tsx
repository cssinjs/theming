import * as React from 'react';
import getDisplayName from 'react-display-name';
import createUseTheme from './create-use-theme';
import { ForwardRefExoticComponent } from 'react';
import { PropsWithoutRef } from 'react';
import { RefAttributes } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export interface WithThemeInnerProps<Theme> {
  theme?: Theme;
}

export type WithThemeFactory<Theme> = <
  InnerProps extends WithThemeInnerProps<Theme>
>(
  component: React.ComponentType<InnerProps>,
) => ForwardRefExoticComponent<
  PropsWithoutRef<InnerProps> & RefAttributes<React.ComponentType<InnerProps>>
>;

function createWithTheme<Theme extends object>(
  context: React.Context<Theme>,
): WithThemeFactory<Theme> {
  const useTheme = createUseTheme(context);

  function factory<InnerProps extends WithThemeInnerProps<Theme>>(
    Component: React.ComponentType<InnerProps>,
  ) {
    const withTheme = React.forwardRef<
      React.ComponentType<InnerProps>,
      InnerProps
    >((props, ref) => {
      const theme = useTheme();

      return <Component ref={ref} theme={theme} {...props} />;
    });

    withTheme.displayName = `WithTheme(${getDisplayName(Component)})`;

    return hoistNonReactStatics(withTheme, Component);
  }

  return factory;
}

export default createWithTheme;

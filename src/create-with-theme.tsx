import * as React from 'react';
import getDisplayName from 'react-display-name';
import createUseTheme from './create-use-theme';
import hoistNonReactStatics from 'hoist-non-react-statics';

export interface WithThemeInnerProps<Theme> {
  theme: Theme;
}

function createWithTheme<Theme>(context: React.Context<Theme>) {
  const useTheme = createUseTheme(context);

  const factory = <
    Props extends WithThemeInnerProps<Theme>,
    WrapperComponent extends React.JSXElementConstructor<Props>
  >(
    Component: WrapperComponent,
  ) => {
    const WithTheme = React.forwardRef<WrapperComponent, Omit<Props, 'theme'>>(
      (props, ref) => {
        const theme = useTheme();

        // @ts-ignore
        return <Component ref={ref} theme={theme} {...props} />;
      },
    );

    WithTheme.displayName = `WithTheme(${getDisplayName(Component)})`;

    return hoistNonReactStatics(WithTheme, Component);
  };

  return factory;
}

export default createWithTheme;

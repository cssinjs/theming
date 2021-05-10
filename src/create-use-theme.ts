import * as React from 'react';
import warning from 'tiny-warning';
import isObject from './is-object';

const createUseTheme = <Theme>(context: React.Context<Theme>) => {
  return () => {
    const theme = React.useContext(context);

    warning(
      isObject(theme),
      '[theming] Please use useTheme only with the ThemeProvider',
    );

    return theme;
  };
};

export default createUseTheme;

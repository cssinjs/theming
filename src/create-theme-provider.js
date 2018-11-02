// @flow

import { type Context } from 'create-react-context';
import React, { type Node } from 'react';
import warning from 'warning';
import PropTypes from 'prop-types';
import isObject from './is-object';

export type ThemeProviderProps<Theme> = {
  children: Node,
  theme: Theme | (outerTheme: Object) => Theme,
};

export default function createThemeProvider<Theme>(context: Context<Theme>) {
  return class ThemeProvider extends React.Component<ThemeProviderProps<Theme>> {
    static propTypes = {
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    };

    static defaultProps = { children: null };

    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    getTheme(outerTheme: Object) {
      const { theme } = this.props;

      if (typeof theme === 'function') {
        const mergedTheme = theme(outerTheme);

        warning(
          isObject(mergedTheme),
          '[ThemeProvider] Please return an object from your theme function',
        );

        return mergedTheme;
      }

      warning(
        isObject(theme),
        '[ThemeProvider] Please make your theme prop a plain object',
      );

      return { ...outerTheme, ...theme };
    }

    render() {
      const { children } = this.props;

      if (!children) {
        return null;
      }

      return (
        <context.Consumer>
          {outerTheme => (
            <context.Provider value={this.getTheme(outerTheme)}>
              {children}
            </context.Provider>
          )}
        </context.Consumer>
      );
    }
  };
}

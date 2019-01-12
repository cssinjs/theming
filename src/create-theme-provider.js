// @flow

import React, { type Node, type Context } from 'react';
import warning from 'tiny-warning';
import PropTypes from 'prop-types';
import isObject from './is-object';

export type ThemeProviderProps<Theme> = {
  children: Node,
  theme: $NonMaybeType<Theme> | (outerTheme: Theme) => $NonMaybeType<Theme>,
};

export default function createThemeProvider<Theme>(context: Context<Theme>) {
  return class ThemeProvider extends React.Component<ThemeProviderProps<Theme>> {
    static propTypes = {
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    };

    static defaultProps = { children: null };

    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    getTheme(outerTheme: Theme) {
      const { theme } = this.props;

      if (theme !== this.lastTheme || outerTheme !== this.lastOuterTheme || !this.cachedTheme) {
        this.lastOuterTheme = outerTheme;
        this.lastTheme = theme;

        if (typeof theme === 'function') {
          this.cachedTheme = theme(outerTheme);

          warning(
            isObject(this.cachedTheme),
            '[ThemeProvider] Please return an object from your theme function',
          );
        } else {
          warning(
            isObject(theme),
            '[ThemeProvider] Please make your theme prop a plain object',
          );

          this.cachedTheme = outerTheme ? { ...outerTheme, ...theme } : theme;
        }
      }

      return this.cachedTheme;
    }

    cachedTheme: Theme;

    lastOuterTheme: Theme;

    lastTheme: $NonMaybeType<Theme>;

    renderProvider = (outerTheme: Theme) => {
      const { children } = this.props;

      return (
        <context.Provider value={this.getTheme(outerTheme)}>
          {children}
        </context.Provider>
      );
    };

    render() {
      const { children } = this.props;

      if (!children) {
        return null;
      }

      return (
        <context.Consumer>
          {this.renderProvider}
        </context.Consumer>
      );
    }
  };
}

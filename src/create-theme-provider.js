// @flow

import React, { type Node, type Context } from 'react';
import warning from 'warning';
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

      // Check if any of the themes have changed or if it we don't have a cached theme yet
      if (theme !== this.lastTheme || outerTheme !== this.lastOuterTheme || !this.cachedTheme) {
        // Update the last themes
        this.lastOuterTheme = outerTheme;
        this.lastTheme = theme;
        let mergedTheme;

        // Compute the new theme
        if (typeof theme === 'function') {
          mergedTheme = theme(outerTheme);

          warning(
            isObject(mergedTheme),
            '[ThemeProvider] Please return an object from your theme function',
          );
        } else {
          warning(
            isObject(theme),
            '[ThemeProvider] Please make your theme prop a plain object',
          );

          mergedTheme = outerTheme ? { ...outerTheme, ...theme } : theme;
        }

        this.cachedTheme = mergedTheme;
      }

      // Return the cached theme
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

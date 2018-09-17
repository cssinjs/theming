// @flow

import { type Context } from 'create-react-context';
import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'is-plain-object';

type Props = {
  children: Node,
  theme: Object | (outerTheme: Object) => Object,
};

export default function createThemeProvider(context: Context<{}>) {
  class ThemeProvider extends React.Component<Props> {
    static propTypes = {
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    };

    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    getTheme(outerTheme: Object) {
      const theme = this.props.theme;

      if (typeof theme === 'function') {
        const mergedTheme = theme(outerTheme);

        if (!isPlainObject(mergedTheme)) {
          throw new Error(
            '[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!',
          );
        }

        return mergedTheme;
      }

      if (!isPlainObject(theme)) {
        throw new Error(
          '[ThemeProvider] Please make your theme prop a plain object',
        );
      }

      if (!outerTheme) {
        return theme;
      }

      return { ...outerTheme, ...theme };
    }

    render() {
      if (!this.props.children) {
        return null;
      }

      return (
        <context.Consumer>
          {outerTheme => (
            <context.Provider value={this.getTheme(outerTheme)}>
              {this.props.children}
            </context.Provider>
          )}
        </context.Consumer>
      );
    }
  }

  return ThemeProvider;
}

// @flow

import { type Context } from 'create-react-context';
import React, { type Node } from 'react';
import warning from 'warning';
import PropTypes from 'prop-types';
import { isObject, isFunction } from './utils';

type Props = {
  children: Node,
  theme: Object | (outerTheme: Object) => Object,
};

export default function createThemeProvider(context: Context<{}>) {
  return class ThemeProvider extends React.Component<Props> {
    static propTypes = {
      children: PropTypes.node,
      theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    };

    static defaultProps = { children: null };

    // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
    getTheme(outerTheme: Object) {
      const theme = this.props.theme;

      if (isFunction(theme)) {
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
  };
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'is-function';
import isPlainObject from 'is-plain-object';
import createBroadcast from './create-broadcast';
import { CHANNEL } from './';

// const noop = () => {}

// NOTE: DO NOT CHANGE, changing this is a semver major change!

/**
 * Provide a theme to an entire react component tree via context
 * and event listeners (have to do both context
 * and event emitter as pure components block context updates)
 */
class ThemeProvider extends Component {
  // outerTheme: Theme
  // unsubscribeToOuter: noop
  // props: ThemeProviderProps
  static propTypes = {
    children: PropTypes.element,
    theme: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func])
      .isRequired,
  };

  static contextTypes = {
    [CHANNEL]: PropTypes.func,
  };

  static childContextTypes = {
    [CHANNEL]: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.getTheme = this.getTheme.bind(this);
  }

  // broadcast: Broadcast

  getChildContext() {
    return { ...this.context, [CHANNEL]: this.broadcast.subscribe };
  }

  componentWillMount() {
    // If there is a ThemeProvider wrapper anywhere around this theme provider, merge this theme
    // with the outer theme
    if (this.context[CHANNEL]) {
      const subscribe = this.context[CHANNEL];
      this.unsubscribeToOuter = subscribe(theme => {
        this.outerTheme = theme;
      });
    }
    this.broadcast = createBroadcast(this.getTheme());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme !== nextProps.theme) {
      this.broadcast.publish(this.getTheme(nextProps.theme));
    }
  }

  componentWillUnmount() {
    if (this.context[CHANNEL]) {
      this.unsubscribeToOuter();
    }
  }

  // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation
  getTheme(passedTheme) {
    const theme = passedTheme || this.props.theme;
    if (isFunction(theme)) {
      const mergedTheme = theme(this.outerTheme);
      if (!isPlainObject(mergedTheme)) {
        throw new Error(
          '[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!'
        );
      }
      return mergedTheme;
    }
    if (!isPlainObject(theme)) {
      throw new Error(
        '[ThemeProvider] Please make your theme prop a plain object'
      );
    }
    return { ...this.outerTheme, ...(theme: Object) };
  }

  render() {
    if (!this.props.children) {
      return null;
    }
    return React.Children.only(this.props.children);
  }
}

export default ThemeProvider;

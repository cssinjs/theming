const React = require('react');
const PropTypes = require('prop-types');
const isFunction = require('is-function');
const isPlainObject = require('is-plain-object');
const createBroadcast = require('./create-broadcast');
const channel = require('./channel');

/**
 * Provide a theme to an entire react component tree via context
 * and event listeners (have to do both context
 * and event emitter as pure components block context updates)
 */

function createThemeProvider(CHANNEL = channel) {
  return class ThemeProvider extends React.Component {
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
      return { ...this.outerTheme, ...(theme: Object) };
    }

    render() {
      if (!this.props.children) {
        return null;
      }
      return React.Children.only(this.props.children);
    }
  };
}

module.exports = createThemeProvider;

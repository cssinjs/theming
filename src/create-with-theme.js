const React = require('react');
const PropTypes = require('prop-types');
const channel = require('./channel');

function createWithTheme(CHANNEL = channel) {
  return Component =>
    class withTheme extends React.Component {
      static contextTypes = {
        [CHANNEL]: PropTypes.func,
      };

      componentWillMount() {
        if (!this.context[CHANNEL]) {
          throw new Error(
            '[withTheme] Please use ThemeProvider to be able to use withTheme',
          );
        }

        const subscribe = this.context[CHANNEL];
        this.unsubscribe = subscribe(theme => {
          this.setState({ theme });
        });
      }

      componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
          this.unsubscribe();
        }
      }

      render() {
        const { theme } = this.state;

        return <Component theme={theme} {...this.props} />;
      }
    };
}

module.exports = createWithTheme;

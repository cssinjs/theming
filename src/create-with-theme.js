const React = require('react');
const PropTypes = require('prop-types');
const channel = require('./channel');

function createWithTheme(CHANNEL = channel) {
  return Component =>
    class withTheme extends React.Component {
      state = { theme: {} };
      setTheme = theme => this.setState({ theme });

      static contextTypes = {
        [CHANNEL]: PropTypes.object.isRequired,
      };

      componentWillMount() {
        if (!this.context[CHANNEL]) {
          throw new Error(
            '[withTheme] Please use ThemeProvider to be able to use withTheme',
          );
        }

        this.setState({ theme: this.context[CHANNEL].getState() });
      }

      componentDidMount() {
        if (this.context[CHANNEL]) {
          this.unsubscribe = this.context[CHANNEL].subscribe(this.setTheme);
        }
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

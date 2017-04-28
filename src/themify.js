const PropTypes = require('prop-types');
const CHANNEL = require('./CHANNEL');

const themify = {
  contextTypes: {
    [CHANNEL]: PropTypes.func,
  },

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
  },

  componentWillUnmount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  },
};

module.exports = themify;

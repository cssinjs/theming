const React = require('react');
const PropTypes = require('prop-types');
const CHANNEL = require('./CHANNEL');

const _onThemeUpdate = fn => class onThemeUpdate extends React.Component {
  static contextTypes = {
    [CHANNEL]: PropTypes.func,
  };

  // state: { theme?: ?Object } = {};
  // unsubscribe: () => void;

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
    const props = this.props;

    return fn({ theme, props });
  }
};

module.exports = _onThemeUpdate;

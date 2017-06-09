import React from 'react';
import PropTypes from 'prop-types';
import channel from './channel';

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component';

function createWithTheme(CHANNEL = channel) {
  return Component =>
    class WithTheme extends React.Component {
      static displayName = `WithTheme(${getDisplayName(Component)})`;
      state = { theme: {} };
      setTheme = theme => this.setState({ theme });

      static contextTypes = {
        [CHANNEL]: PropTypes.object.isRequired,
      };

      componentWillMount() {
        if (!this.context[CHANNEL]) {
          throw new Error(
            '[WithTheme(${getDisplayName(Component)})] Please use ThemeProvider to be able to use WithTheme',
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

export default createWithTheme;

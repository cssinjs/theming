import PropTypes from 'prop-types';
import channel from './channel';

export default function createThemeListener(CHANNEL = channel) {
  const contextTypes = {
    [CHANNEL]: PropTypes.object.isRequired,
  };

  function init(cb) {
    if (!this.context[CHANNEL]) {
      throw new Error(
        `[${this.displayName}] Please use ThemeProvider to be able to use WithTheme`,
      );
    }

    cb(this.context[CHANNEL].getState());
  }

  function subscribe(cb) {
    if (this.context[CHANNEL]) {
      this.unsubscribe = this.context[CHANNEL].subscribe(cb);
    }
  }

  function unsubscribe() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  return {
    contextTypes,
    init,
    subscribe,
    unsubscribe,
  };
}

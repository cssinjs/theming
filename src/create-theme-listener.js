const PropTypes = require('prop-types');
const channel = require('./channel');

function createThemeListener(CHANNEL = channel) {
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

module.exports = createThemeListener;

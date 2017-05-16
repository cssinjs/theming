import test from 'ava';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import browserEnv from 'browser-env';

import isFunction from 'is-function';
import createWithTheme from './create-with-theme';
import channel from './channel';
import createBroadcast from './create-broadcast';
import { Comp, Pure } from './helpers';

browserEnv(['window', 'document', 'navigator']);

test(`createWithTheme's type`, t => {
  t.true(isFunction(createWithTheme), `createWithTheme should be a function`);
});

test(`createWithTheme's result is function on its own`, t => {
  const withTheme = createWithTheme();
  t.true(isFunction(withTheme), `withTheme should be a function`);
});

test(`withTheme(Comp) result instance type`, t => {
  const withTheme = createWithTheme();
  t.true(
    Component.isPrototypeOf(withTheme(Comp)),
    `withTheme(Comp) should be a React Component`,
  );
});

const getContextTypes = C => C.contextTypes;
const getChannel = C => Object.keys(getContextTypes(C))[0];

test(`withTheme(Comp)'s default channel`, t => {
  const withTheme = createWithTheme();
  t.is(
    getChannel(withTheme(Comp)),
    channel,
    `withTheme(Comp) should have default channel`,
  );
});

test(`withTheme(Comp) custom channel`, t => {
  const withTheme = createWithTheme('__CUSTOM__');
  t.is(
    getChannel(withTheme(Comp)),
    '__CUSTOM__',
    `createWithTheme() should have custom channel`,
  );
});

class ThemePropInterceptor extends Component {
  static propTypes = {
    intercept: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.props.intercept(props.theme);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.props.intercept(nextProps.theme);
    }
  }
  // eslint-disable-next-line
  render() {
    return <div />;
  }
}

const mountOptions = broadcast => ({
  childContextTypes: {
    [channel]: PropTypes.func.isRequired,
  },
  context: {
    [channel]: broadcast.subscribe,
  },
});

test('withTheme(Comp) receive theme', t => {
  const withTheme = createWithTheme();
  const expectedTheme = { themed: true };
  let actualTheme;
  const updateActualTheme = theme => {
    actualTheme = theme;
  };

  const ComponentWithTheme = withTheme(ThemePropInterceptor);
  const broadcast = createBroadcast(expectedTheme);

  mount(
    <ComponentWithTheme intercept={updateActualTheme} />,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `withTheme(Comp) should receive theme`,
  );
});

test(`withTheme(Comp) receive theme deep into tree`, t => {
  const withTheme = createWithTheme();
  const expectedTheme = { themed: true };
  let actualTheme;
  const updateActualTheme = theme => {
    actualTheme = theme;
  };

  const ComponentWithTheme = withTheme(ThemePropInterceptor);
  const broadcast = createBroadcast(expectedTheme);

  mount(
    <div>
      <div>
        <ComponentWithTheme intercept={updateActualTheme} />
      </div>
    </div>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `withTheme(Comp) should receive a theme deep down into tree`,
  );
});

test(`withTheme(Comp) receives theme through PureComponent`, t => {
  const withTheme = createWithTheme();
  const expectedTheme = { themed: true };
  let actualTheme;
  const updateActualTheme = theme => {
    actualTheme = theme;
  };

  const ComponentWithTheme = withTheme(ThemePropInterceptor);
  const broadcast = createBroadcast(expectedTheme);

  mount(
    <Pure>
      <ComponentWithTheme intercept={updateActualTheme} />
    </Pure>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `withTheme(Comp) should receive a theme deep down into tree`,
  );
});

test(`withTheme(Comp) receives theme updates`, t => {
  const withTheme = createWithTheme();
  const initTheme = { themed: true };
  const updatedTheme = { updated: true };
  let actualTheme;
  const updateActualTheme = theme => {
    actualTheme = theme;
  };

  const ComponentWithTheme = withTheme(ThemePropInterceptor);
  const broadcast = createBroadcast(initTheme);

  mount(
    <ComponentWithTheme intercept={updateActualTheme} />,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actualTheme,
    initTheme,
    `withTheme(Comp) should receive initial theme`,
  );

  broadcast.publish(updatedTheme);

  t.deepEqual(
    actualTheme,
    updatedTheme,
    `withTheme(Comp) should receive theme updates`,
  );
});

test(`withTheme(Comp) receives theme updates even through PureComponent`, t => {
  const withTheme = createWithTheme();
  const initTheme = { themed: true };
  const updatedTheme = { updated: true };
  let actualTheme;
  const updateActualTheme = theme => {
    actualTheme = theme;
  };

  const ComponentWithTheme = withTheme(ThemePropInterceptor);
  const broadcast = createBroadcast(initTheme);

  mount(
    <Pure>
      <ComponentWithTheme intercept={updateActualTheme} />
    </Pure>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actualTheme,
    initTheme,
    `withTheme(Comp) should receive initial theme even through PureComponent`,
  );

  broadcast.publish(updatedTheme);

  t.deepEqual(
    actualTheme,
    updatedTheme,
    `withTheme(Comp) should receive theme updates even through PureComponent`,
  );
});

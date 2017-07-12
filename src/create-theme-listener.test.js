import test from 'ava';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createBroadcast from 'brcast';
import { mount } from 'enzyme';
import isFunction from 'is-function';
import isPainObject from 'is-plain-object';
import { getChannel, Pure, mountOptions, getInterceptor } from './test-helpers';
import CHANNEL from './channel';
import createThemeListener from './create-theme-listener';

test(`createThemeListener's type`, t => {
  const actual = isFunction(createThemeListener);
  t.true(actual, `createThemeListener should be a function`);
});

test(`createThemeListener's result's type`, t => {
  const actual = isPainObject(createThemeListener());
  t.true(actual, `createThemeListener() should be an object`);
});

test(`themeListener's fields`, t => {
  const actual = Object.keys(createThemeListener());
  const expected = ['contextTypes', 'initial', 'subscribe'];

  t.deepEqual(
    actual,
    expected,
    `themeListener should have contextTypes and bind fields`,
  );
});

test(`themeListener's default channel`, t => {
  const themeListener = createThemeListener();
  const actual = getChannel(themeListener);
  const expected = CHANNEL;

  t.is(actual, expected, `themeListener should use default channel by default`);
});

test(`themeListener's custom channel`, t => {
  const customChannel = '__CUSTOM__';
  const themeListener = createThemeListener(customChannel);
  const actual = getChannel(themeListener);
  const expected = customChannel;

  t.is(
    actual,
    expected,
    `themeListener should have custom channel if one is passed`,
  );
});

test(`themeListener's initial and subscribe`, t => {
  const themeListener = createThemeListener();
  const { initial, subscribe } = themeListener;
  const actual = [initial, subscribe].every(isFunction);

  t.true(
    actual,
    `themeListener's init, subscribe and unsubscribe should be a function`,
  );
});

const getTrap = themeListener => {
  return class ThemeListenerTrap extends Component {
    static propTypes = {
      intercept: PropTypes.func.isRequired,
    };
    static contextTypes = themeListener.contextTypes;
    constructor(props, context) {
      super(props, context);
      this.props.intercept(themeListener.initial(context))
    }
    componentDidMount() {
      this.unsubscribe = themeListener.subscribe(this.context, this.props.intercept)
    }
    componentWillUnmount() {
      if (typeof this.unsubscribe === 'function') {
        this.unsubscribe()
      }
    }
    // eslint-disable-next-line
    render() {
      return <div />;
    }
  };
};

test(`themeListener without ThemeProvider`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);

  t.throws(
    () => {
      mount(<Trap intercept={() => {}} />);
    },
    Error,
    `themeListener should throw if used without appropriate context`,
  );
});

test(`themeListener and init`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor();
  const expected = theme;

  mount(<Trap intercept={actual} />, mountOptions(broadcast));

  t.deepEqual(actual(), expected, 'init should get initial theme');
});

test(`themeListener, init and nested react tree`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <div>
      <div>
        <Trap intercept={actual} />
      </div>
    </div>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actual(),
    expected,
    'init should get initial theme through nested react tree',
  );
});

test(`themeListener, init and PureComponent`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <Pure>
      <Trap intercept={actual} />
    </Pure>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actual(),
    expected,
    'init should get initial theme through PureComponent',
  );
});

test(`themeListener and subscribe`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const update = { updated: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor(theme);
  const expected = update;

  mount(<Trap intercept={actual} />, mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(actual(), expected, 'subscribe should get theme update');
});

test(`themeListener, subscribe and nested react tree`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const update = { updated: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor(theme);
  const expected = update;

  mount(
    <div>
      <div>
        <Trap intercept={actual} />
      </div>
    </div>,
    mountOptions(broadcast),
  );

  broadcast.setState(update);

  t.deepEqual(
    actual(),
    expected,
    'subscribe should get theme update through nested tree',
  );
});

test(`themeListener, subscribe and PureComponent`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const update = { updated: true };
  const broadcast = createBroadcast(theme);
  const actual = getInterceptor(theme);
  const expected = update;

  mount(
    <Pure>
      <Trap intercept={actual} />
    </Pure>,
    mountOptions(broadcast),
  );

  broadcast.setState(update);

  t.deepEqual(
    actual(),
    expected,
    'subscribe should get theme update through PureComponent',
  );
});

test(`themeListener and unsubscribe`, t => {
  const themeListener = createThemeListener();
  const Trap = getTrap(themeListener);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const unsubscribed = getInterceptor(false);

  const wrapper = mount(<Trap intercept={() => {}} />, mountOptions(broadcast));
  wrapper.instance().unsubscribe = () => unsubscribed(true);

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), 'unsubscribe should happen on unmount');
});

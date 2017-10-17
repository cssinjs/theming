import test from 'ava';
import React, { Component } from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import isFunction from 'is-function';
import createWithTheme from './create-with-theme';
import channel from './channel';
import createBroadcast from 'brcast';
import {
  getChannel,
  Comp,
  Pure,
  Trap,
  mountOptions,
  getInterceptor,
} from './test-helpers';

configure({ adapter: new Adapter() });

test(`createWithTheme's type`, t => {
  const actual = isFunction(createWithTheme);
  t.true(actual, `createWithTheme should be a function`);
});

test(`createWithTheme's result is function on its own`, t => {
  const withTheme = createWithTheme();
  const actual = isFunction(withTheme);
  t.true(actual, `withTheme should be a function`);
});

test(`withTheme(Comp) result instance type`, t => {
  const withTheme = createWithTheme();
  const actual = Component.isPrototypeOf(withTheme(Comp));
  t.true(actual, `withTheme(Comp) should be a React Component`);
});

test(`withTheme(Comp)'s default channel`, t => {
  const withTheme = createWithTheme();
  const actual = getChannel(withTheme(Comp));
  const expected = channel;
  t.is(actual, expected, `withTheme(Comp) should have default channel`);
});

test(`withTheme(Comp) custom channel`, t => {
  const custom = '__CUSTOM__';
  const withTheme = createWithTheme(custom);
  const actual = getChannel(withTheme(Comp));
  const expected = custom;
  t.is(actual, expected, `createWithTheme() should work with custom channel`);
});

test(`withTheme(Comp) and stateless component`, t => {
  const withTheme = createWithTheme();
  const StatelessComp = (...props) => <div {...props} />;
  const ThemedComp = withTheme(StatelessComp);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const wrapper = shallow(
    <div><ThemedComp /></div>,
    mountOptions(broadcast),
  ).childAt(0);
  const actual = wrapper.name();
  const expected = `WithTheme(StatelessComp)`;

  t.is(
    actual,
    expected,
    `withTheme(Comp) should include wrapped stateless component's name in the displayName`,
  );
});

test(`withTheme(Comp) and statefull component`, t => {
  const withTheme = createWithTheme();
  class StatefullComp extends Component {
    render() {
      return <div {...this.props} />;
    }
  }
  const ThemedComp = withTheme(StatefullComp);
  const theme = { themed: true };
  const broadcast = createBroadcast(theme);
  const wrapper = shallow(
    <div><ThemedComp /></div>,
    mountOptions(broadcast),
  ).childAt(0);
  const actual = wrapper.name();
  const expected = `WithTheme(StatefullComp)`;

  t.is(
    actual,
    expected,
    `withTheme(Comp) should include wrapped statefull component's name in the displayName`,
  );
});

test(`withTheme(Comp) unsubscribes on unmounting`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(theme);
  const unsubscribed = getInterceptor(false);

  const wrapper = mount(
    <ComponentWithTheme intercept={() => {}} />,
    mountOptions(broadcast),
  );
  wrapper.instance().unsubscribe = () => unsubscribed(true);

  t.false(unsubscribed());

  wrapper.unmount();

  t.true(unsubscribed(), `withTheme(Comp) should unsubscribe on unmounting`);
});

test(`withTheme(Comp) without ThemeProvider`, t => {
  const withTheme = createWithTheme();
  const ComponentWithTheme = withTheme(Trap.Prop);

  t.throws(
    () => {
      mount(<ComponentWithTheme intercept={() => {}} />);
    },
    Error,
    `withTheme(Comp) should throw if used without appropriate context`,
  );
});

test(`withTheme(Comp) receive theme`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(theme);

  mount(<ComponentWithTheme intercept={actual} />, mountOptions(broadcast));

  t.deepEqual(actual(), expected, `withTheme(Comp) should receive theme`);
});

test(`withTheme(Comp) receive theme deep into tree`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(expected);

  mount(
    <div>
      <div>
        <ComponentWithTheme intercept={actual} />
      </div>
    </div>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actual(),
    expected,
    `withTheme(Comp) should receive a theme deep down into tree`,
  );
});

test(`withTheme(Comp) receives theme through PureComponent`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const actual = getInterceptor();
  const expected = theme;

  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(expected);

  mount(
    <Pure>
      <ComponentWithTheme intercept={actual} />
    </Pure>,
    mountOptions(broadcast),
  );

  t.deepEqual(
    actual(),
    expected,
    `withTheme(Comp) should receive theme through PureComponent`,
  );
});

test(`withTheme(Comp) receives theme updates`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const update = { updated: true };
  const actual = getInterceptor();
  const expected = update;

  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(theme);

  mount(<ComponentWithTheme intercept={actual} />, mountOptions(broadcast));

  broadcast.setState(update);

  t.deepEqual(
    actual(),
    expected,
    `withTheme(Comp) should receive theme updates`,
  );
});

test(`withTheme(Comp) receives theme updates even through PureComponent`, t => {
  const withTheme = createWithTheme();
  const theme = { themed: true };
  const update = { updated: true };
  const actual = getInterceptor();
  const expected = update;

  const ComponentWithTheme = withTheme(Trap.Prop);
  const broadcast = createBroadcast(theme);

  mount(
    <Pure>
      <ComponentWithTheme intercept={actual} />
    </Pure>,
    mountOptions(broadcast),
  );

  broadcast.setState(update);

  t.deepEqual(
    actual(),
    expected,
    `withTheme(Comp) should receive theme updates even through PureComponent`,
  );
});

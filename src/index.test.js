import test from 'ava';
import React from 'react';
import { mount } from 'enzyme';
import isFunction from 'is-function';
import isPlainObject from 'is-plain-object';
import { Trap, Pure, Comp, getInterceptor, getChannel } from './test-helpers';

import { channel, createTheming, ThemeProvider, withTheme } from './index';

test(`createTheming's type`, t => {
  const actual = isFunction(createTheming);
  t.true(actual, `createTheming should be a function`);
});

test(`createTheming()'s type`, t => {
  const theming = createTheming();
  const actual = isPlainObject(theming);
  t.true(actual, `createTheming() should be an object`);
});

test(`createTheming()'s key names`, t => {
  const theming = createTheming();
  const actual = Object.keys(theming);
  const expected = ['channel', 'withTheme', 'ThemeProvider', 'themeListener'];

  t.deepEqual(
    actual,
    expected,
    `createTheming()' keys are withTheme and ThemeProvider`,
  );
});

test(`theming default channel`, t => {
  const defaultChannel = channel;
  const theming = createTheming();
  const actual = {
    themeProviderChannel: getChannel(theming.ThemeProvider),
    withThemeChannel: getChannel(theming.withTheme(Comp)),
  };
  const expected = {
    themeProviderChannel: defaultChannel,
    withThemeChannel: defaultChannel,
  };

  t.deepEqual(
    actual,
    expected,
    `createTheming() hocs have default channel by default`,
  );
});

test(`theming custom channel`, t => {
  const customChannel = '__CUSTOM__';
  const theming = createTheming(customChannel);
  const actual = {
    themeProviderChannel: getChannel(theming.ThemeProvider),
    withThemeChannel: getChannel(theming.withTheme(Comp)),
  };
  const expected = {
    themeProviderChannel: customChannel,
    withThemeChannel: customChannel,
  };

  t.deepEqual(
    actual,
    expected,
    `createTheming() hocs have custom channel if one is provided`,
  );
});

test('Theming and initial theme', t => {
  const theme = { themed: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={theme}>
      <ComponentWithTheme intercept={actual} />
    </ThemeProvider>,
  );

  t.deepEqual(actual(), expected, `Theming passes initial theme`);
});

test('Theming, intitial theme and deep react tree', t => {
  const theme = { themed: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={theme}>
      <ComponentWithTheme intercept={actual} />
    </ThemeProvider>,
  );

  t.deepEqual(
    actual(),
    expected,
    `Theming should pass initial theme through deep react tree`,
  );
});

test('Theming, intitial theme and Pure Component', t => {
  const theme = { themed: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const actual = getInterceptor();
  const expected = theme;

  mount(
    <ThemeProvider theme={theme}>
      <Pure>
        <ComponentWithTheme intercept={actual} />
      </Pure>
    </ThemeProvider>,
  );

  t.deepEqual(
    actual(),
    expected,
    `Theming should pass initial theme through PureComponent`,
  );
});

test('Theming and updates', t => {
  const theme = { themed: true };
  const update = { updated: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const actual = getInterceptor();
  const expected = update;

  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <ComponentWithTheme intercept={actual} />
    </ThemeProvider>,
  );

  wrapper.setProps({ theme: update });

  t.deepEqual(actual(), expected, `default theming should pass theme update`);
});

test('Theming, updates and PureComponent', t => {
  const theme = { themed: true };
  const update = { updated: true };
  const ComponentWithTheme = withTheme(Trap.Prop);
  const actual = getInterceptor();
  const expected = update;

  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <Pure>
        <ComponentWithTheme intercept={actual} />
      </Pure>
    </ThemeProvider>,
  );

  wrapper.setProps({ theme: update });

  t.deepEqual(
    actual(),
    expected,
    `default theming should pass theme update through Pure Component`,
  );
});

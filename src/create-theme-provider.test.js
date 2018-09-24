// @flow

import test from 'ava';
import createReactContext from 'create-react-context';
import React, { Component } from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import createThemeProvider from './create-theme-provider';
import { Comp } from './test-helpers';

test(`createThemeProvider's type`, t => {
  t.true(typeof createThemeProvider === 'function', `createThemeProvider should be a function`);
});

test(`createThemeProvider's result instance type`, t => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);
  const actual = Component.isPrototypeOf(ThemeProvider);
  t.true(actual, `createThemeProvider() should be a React Component`);
});

test('should call the theme fn with the default theme', t => {
  const defaultTheme = {};
  const themeFn = sinon.spy(outerTheme => outerTheme);
  const context = createReactContext(defaultTheme);
  const ThemeProvider = createThemeProvider(context);

  mount((
    <ThemeProvider theme={themeFn}>
      <Comp />
    </ThemeProvider>
  ));

  t.true(themeFn.calledWith(defaultTheme));
});

test('should call the theme fn with the outerTheme', t => {
  const outerTheme = {};
  const themeFn = sinon.spy(theme => theme);
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);

  mount((
    <ThemeProvider theme={outerTheme}>
      <ThemeProvider theme={themeFn}>
        <Comp />
      </ThemeProvider>
    </ThemeProvider>
  ));

  t.true(themeFn.calledWith(outerTheme));
});

test('should merge nested themes', t => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);
  const themeA = { themeA: 'a' };
  const themeB = { themeB: 'b' };

  const wrapper = mount((
    <ThemeProvider theme={themeA}>
      <ThemeProvider theme={themeB}>
        <context.Consumer>
          {theme => <div theme={theme} />}
        </context.Consumer>
      </ThemeProvider>
    </ThemeProvider>
  ));

  t.deepEqual(
    wrapper.find('div').prop('theme'),
    {
      themeA: 'a',
      themeB: 'b',
    },
  );
});

test('should not render any Consumer and Provider if no children were passed', t => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);

  const wrapper = mount((
    <ThemeProvider theme={{}} />
  ));

  t.deepEqual(wrapper.find('ThemeProvider').children().length, 0);
});
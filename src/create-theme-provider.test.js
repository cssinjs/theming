// @flow

import test from 'ava';
import createReactContext from 'create-react-context';
import React from 'react';
import sinon from 'sinon';
import TestRenderer from 'react-test-renderer';

import createThemeProvider from './create-theme-provider';

const Comp = () => null;

test('createThemeProvider\'s type', (t) => {
  t.true(typeof createThemeProvider === 'function', 'createThemeProvider should be a function');
});

test('should call the theme fn with the default theme', (t) => {
  const defaultTheme = {};
  const themeFn = sinon.spy(outerTheme => outerTheme);
  const context = createReactContext(defaultTheme);
  const ThemeProvider = createThemeProvider(context);

  TestRenderer.create((
    <ThemeProvider theme={themeFn}>
      <Comp />
    </ThemeProvider>
  ));

  t.true(themeFn.calledWith(defaultTheme));
});

test('should call the theme fn with the outerTheme', (t) => {
  const outerTheme = {};
  const themeFn = sinon.spy(theme => theme);
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);

  TestRenderer.create((
    <ThemeProvider theme={outerTheme}>
      <ThemeProvider theme={themeFn}>
        <Comp />
      </ThemeProvider>
    </ThemeProvider>
  ));

  t.true(themeFn.calledWith(outerTheme));
});

test('should merge nested themes', (t) => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);
  const themeA = { themeA: 'a' };
  const themeB = { themeB: 'b' };

  const { root } = TestRenderer.create((
    <ThemeProvider theme={themeA}>
      <ThemeProvider theme={themeB}>
        <context.Consumer>
          {theme => <Comp theme={theme} />}
        </context.Consumer>
      </ThemeProvider>
    </ThemeProvider>
  ));

  t.deepEqual(
    root.findByType(Comp).props.theme,
    {
      themeA: 'a',
      themeB: 'b',
    },
  );
});

test('should not render any Consumer and Provider if no children were passed', (t) => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);

  const { root } = TestRenderer.create((
    <ThemeProvider theme={{}} />
  ));

  t.deepEqual(root.findByType(ThemeProvider).children.length, 0);
});

test('should return not modify the theme when the ThemeProvider isn\'t nested', (t) => {
  const context = createReactContext();
  const ThemeProvider = createThemeProvider(context);
  const themeA = {};
  let receivedTheme;

  TestRenderer.create((
    <ThemeProvider theme={themeA}>
      <context.Consumer>
        {(theme) => {
          receivedTheme = theme;
          return null;
        }}
      </context.Consumer>
    </ThemeProvider>
  ));

  t.true(themeA === receivedTheme);
});

test('should create new theme object when 2 ThemeProvider\'s are nested', (t) => {
  const context = createReactContext();
  const ThemeProvider = createThemeProvider(context);
  const themeA = {};
  const themeB = {};
  let receivedTheme;

  TestRenderer.create((
    <ThemeProvider theme={themeA}>
      <ThemeProvider theme={themeB}>
        <context.Consumer>
          {(theme) => {
            receivedTheme = theme;
            return null;
          }}
        </context.Consumer>
      </ThemeProvider>
    </ThemeProvider>
  ));

  t.true(themeA !== receivedTheme);
  t.true(themeB !== receivedTheme);
});

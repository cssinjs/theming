import test from 'ava';
import * as React from 'react';
import * as sinon from 'sinon';
import * as TestRenderer from 'react-test-renderer';

import createThemeProvider from './create-theme-provider';

const Comp = (_: { theme?: unknown }) => null;

test('should call the theme fn with the default theme', t => {
  const defaultTheme = {};
  const themeFn = sinon.spy((outerTheme: unknown) => outerTheme);
  const context = React.createContext(defaultTheme);
  const ThemeProvider = createThemeProvider(context);

  TestRenderer.create(
    <ThemeProvider theme={themeFn}>
      <Comp />
    </ThemeProvider>,
  );

  t.true(themeFn.calledWith(defaultTheme));
});

test('should call the theme fn with the outerTheme', t => {
  const outerTheme = {};
  const themeFn = sinon.spy((theme: unknown) => theme);
  const context = React.createContext({});
  const ThemeProvider = createThemeProvider(context);

  TestRenderer.create(
    <ThemeProvider theme={outerTheme}>
      <ThemeProvider theme={themeFn}>
        <Comp />
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.true(themeFn.calledWith(outerTheme));
});

test('should merge nested themes', t => {
  const context = React.createContext({});
  const ThemeProvider = createThemeProvider(context);
  const themeA: Object = { themeA: 'a' };
  const themeB: Object = { themeB: 'b' };

  const { root } = TestRenderer.create(
    <ThemeProvider theme={themeA}>
      <ThemeProvider theme={themeB}>
        <context.Consumer>{theme => <Comp theme={theme} />}</context.Consumer>
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(root.findByType(Comp).props.theme, {
    themeA: 'a',
    themeB: 'b',
  });
});

test('should merge two nested theme objects', t => {
  const context = React.createContext({});
  const ThemeProvider = createThemeProvider(context);
  const themeA = {
    colorA: 'red',
  };
  const themeB = {
    colorB: 'blue',
  };
  let receivedTheme;

  TestRenderer.create(
    <ThemeProvider theme={themeA}>
      <ThemeProvider theme={themeB}>
        <context.Consumer>
          {theme => {
            receivedTheme = theme;
            return null;
          }}
        </context.Consumer>
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(receivedTheme, {
    colorA: 'red',
    colorB: 'blue',
  });
});

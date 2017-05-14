import test from 'ava';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme'; // eslint-disable-line
import browserEnv from 'browser-env';

import isFunction from 'is-function';
import createThemeProvider from './create-theme-provider';
import channel from './channel';

browserEnv(['window', 'document', 'navigator']);

test(`createThemeProvider's type`, t => {
  t.true(
    isFunction(createThemeProvider),
    `createThemeProvider should be a function`,
  );
});

test(`createThemeProvider's result instance type`, t => {
  const ThemeProvider = createThemeProvider();
  t.true(
    Component.isPrototypeOf(ThemeProvider),
    `createThemeProvider() should be a React Component`,
  );
});

const getContextTypes = C => C.contextTypes;
const getChannel = C => Object.keys(getContextTypes(C))[0];

test(`ThemeProvider default channel`, t => {
  const ThemeProvider = createThemeProvider();
  t.is(
    getChannel(ThemeProvider),
    channel,
    `createThemeProvider() should be a React Component`,
  );
});

test(`ThemeProvider custom channel`, t => {
  const ThemeProvider = createThemeProvider('__CUSTOM__');
  t.is(
    getChannel(ThemeProvider),
    '__CUSTOM__',
    `createThemeProvider() should be a React Component`,
  );
});

const onThemeChild = (inputChannel = channel) => {
  class Child extends Component {
    componentWillMount() {
      const subscribe = this.context[inputChannel] || (() => {});
      this.unsubscribe = subscribe(theme => {
        this.props.onTheme(theme);
      });
    }
    // eslint-disable-next-line
    render() {
      return <div />;
    }
  }
  Child.propTypes = {
    onTheme: PropTypes.func.isRequired,
  };
  Child.contextTypes = {
    [inputChannel]: PropTypes.func.isRequired,
  };
  return Child;
};

const getPure = () =>
  class Pure extends PureComponent {
    static propTypes = {
      children: PropTypes.node.isRequired,
    };
    render() {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
  };

test('ThemeProvider passes theme', t => {
  const ThemeProvider = createThemeProvider();
  const Child = onThemeChild();
  const expectedTheme = { themed: true };
  let actualTheme;
  const intercept = theme => {
    actualTheme = theme;
  };

  mount(
    <ThemeProvider theme={expectedTheme}>
      <Child onTheme={intercept} />
    </ThemeProvider>,
  );

  t.deepEqual(actualTheme, expectedTheme, `ThemeProvider should pass a theme`);
});

test('ThemeProvider passes theme deep into tree', t => {
  const ThemeProvider = createThemeProvider();
  const Child = onThemeChild();
  const expectedTheme = { themed: true };
  let actualTheme;
  const intercept = theme => {
    actualTheme = theme;
  };

  mount(
    <ThemeProvider theme={expectedTheme}>
      <div>
        <div>
          <Child onTheme={intercept} />
        </div>
      </div>
    </ThemeProvider>,
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `ThemeProvider should pass a theme deep down into tree`,
  );
});

test('ThemeProvider passes theme through PureComponent', t => {
  const ThemeProvider = createThemeProvider();
  const Child = onThemeChild();
  const Pure = getPure();
  const expectedTheme = { themed: true };
  let actualTheme;
  const intercept = theme => {
    actualTheme = theme;
  };

  mount(
    <ThemeProvider theme={expectedTheme}>
      <Pure>
        <Child onTheme={intercept} />
      </Pure>
    </ThemeProvider>,
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `ThemeProvider should pass a theme through PureComponent`,
  );
});

test('ThemeProvider themes objects merging', t => {
  const ThemeProvider = createThemeProvider();
  const Child = onThemeChild();
  const initTheme = { themed: true };
  const themeToMerge = { merged: true };
  const expectedTheme = { themed: true, merged: true };
  let actualTheme;
  const intercept = theme => {
    actualTheme = theme;
  };

  mount(
    <ThemeProvider theme={initTheme}>
      <ThemeProvider theme={themeToMerge}>
        <Child onTheme={intercept} />
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `ThemeProvider should pass merge themes`,
  );
});

test('ThemeProvider theme augmenting', t => {
  const ThemeProvider = createThemeProvider();
  const Child = onThemeChild();
  const initTheme = { themed: true };
  const merge = x => y => Object.assign({}, x, y);
  const augment = merge({ augmented: true });
  const expectedTheme = { themed: true, augmented: true };
  let actualTheme;
  const intercept = theme => {
    actualTheme = theme;
  };

  mount(
    <ThemeProvider theme={initTheme}>
      <ThemeProvider theme={augment}>
        <Child onTheme={intercept} />
      </ThemeProvider>
    </ThemeProvider>,
  );

  t.deepEqual(
    actualTheme,
    expectedTheme,
    `ThemeProvider should pass merge themes`,
  );
});

// @flow
import test from 'ava';
import createReactContext from 'create-react-context';
import React from 'react';
import TestRenderer from 'react-test-renderer';

import createWithTheme from './create-with-theme';

// eslint-disable-next-line no-unused-vars
const Comp = (props: { theme: {} }) => null;

test('createWithTheme\'s type', (t) => {
  t.true(typeof createWithTheme === 'function', 'createWithTheme should be a function');
});

test('createWithTheme\'s result is function on its own', (t) => {
  const context = createReactContext({});
  const withTheme = createWithTheme(context);

  t.true(typeof withTheme === 'function', 'withTheme should be a function');
});

test('should pass the default value of the context', (t) => {
  const theme = {};
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp);
  const { root } = TestRenderer.create(<WithTheme />);

  t.true(root.findByType(Comp).props.theme === theme);
});


test('should pass the value of the Provider', (t) => {
  const theme = { test: 'test' };
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp);
  const { root } = TestRenderer.create((
    <context.Provider value={theme}>
      <WithTheme />
    </context.Provider>
  ));

  t.true(root.findByType(Comp).props.theme === theme);
});

test('should allow overriding the prop from the outer props', (t) => {
  const theme = {};
  const otherTheme = {};
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp);
  const { root } = TestRenderer.create((
    <WithTheme theme={otherTheme} />
  ));

  t.true(root.findByType(Comp).props.theme === otherTheme);
});

test('withTheme(Comp) hoists non-react static class properties', (t) => {
  const context = createReactContext({});
  const withTheme = createWithTheme(context);
  class ExampleComponent extends React.Component<{ theme: {} }> {
    static displayName = 'foo';

    static someSpecialStatic = 'bar';
  }
  const ComponentWithTheme = withTheme(ExampleComponent);
  t.deepEqual(
    ComponentWithTheme.displayName,
    'WithTheme(foo)',
    'withTheme(Comp) should not hoist react static properties',
  );
  t.deepEqual(
    // $FlowFixMe: Need to find a better way to type the hoist-non-react-statics
    ComponentWithTheme.someSpecialStatic,
    ExampleComponent.someSpecialStatic,
    'withTheme(Comp) should hoist non-react static properties',
  );
});

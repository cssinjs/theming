// @flow
import test from 'ava';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon from 'sinon';

import createWithTheme from './create-with-theme';

type Props = { theme: {} };

// eslint-disable-next-line no-unused-vars
const FunctionalComponent = (props: Props) => null;

class ClassComponent extends React.Component<Props> {
  static displayName = 'foo';

  static someSpecialStatic = 'bar';

  inner = true;

  render() {
    return null;
  }
}

test("createWithTheme's type", t => {
  t.true(
    typeof createWithTheme === 'function',
    'createWithTheme should be a function'
  );
});

test("createWithTheme's result is function on its own", t => {
  const context = React.createContext({});
  const withTheme = createWithTheme(context);

  t.true(typeof withTheme === 'function', 'withTheme should be a function');
});

test('should pass the default value of the context', t => {
  const theme = {};
  const context = React.createContext(theme);
  const WithTheme = createWithTheme(context)(FunctionalComponent);
  const { root } = TestRenderer.create(<WithTheme />);

  t.true(root.findByType(FunctionalComponent).props.theme === theme);
});

test('should pass the value of the Provider', t => {
  const theme = { test: 'test' };
  const context = React.createContext(theme);
  const WithTheme = createWithTheme(context)(FunctionalComponent);
  const { root } = TestRenderer.create(
    <context.Provider value={theme}>
      <WithTheme />
    </context.Provider>
  );

  t.true(root.findByType(FunctionalComponent).props.theme === theme);
});

test('should allow overriding the prop from the outer props', t => {
  const otherTheme = {};
  const context = React.createContext<{}>({});
  const WithTheme = createWithTheme<{}>(context)(FunctionalComponent);
  const { root } = TestRenderer.create(<WithTheme theme={otherTheme} />);

  t.true(root.findByType(FunctionalComponent).props.theme === otherTheme);
});

test('normal refs should just work and correctly be forwarded', t => {
  const context = React.createContext({});
  const WithTheme = createWithTheme(context)(ClassComponent);
  let refComp = null;
  const innerRef = comp => {
    refComp = comp;
  };

  TestRenderer.create(<WithTheme ref={innerRef} />);

  t.deepEqual(refComp !== null && refComp.inner, true);
});

test('withTheme(Comp) hoists non-react static class properties', t => {
  const context = React.createContext({});
  const withTheme = createWithTheme(context);
  const WithTheme = withTheme(ClassComponent);

  t.deepEqual(
    WithTheme.displayName,
    'WithTheme(foo)',
    'withTheme(Comp) should not hoist react static properties'
  );
  t.deepEqual(
    // $FlowFixMe: Need to find a better way to type the hoist-non-react-statics
    WithTheme.someSpecialStatic,
    ClassComponent.someSpecialStatic,
    'withTheme(Comp) should hoist non-react static properties'
  );
});

test("should warn when theme isn't an object", t => {
  const spy = sinon.spy(console, 'warn');

  const context = React.createContext<{} | void>();
  const withTheme = createWithTheme(context);
  const WithTheme = withTheme(ClassComponent);

  TestRenderer.create(<WithTheme />);

  t.deepEqual(spy.callCount, 1);

  spy.restore();
});

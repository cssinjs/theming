import test from 'ava';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import sinon from 'sinon';

import createWithTheme from './create-with-theme'

type Props = {|theme: {||}|}

// eslint-disable-next-line no-unused-vars
const FunctionalComponent = (_: Props) => null;

class ClassComponent extends React.Component<Props> {
  static displayName = 'foo'

  static someSpecialStatic = 'bar'

  inner = true

  render() {
    return null
  }
}

test("createWithTheme's type", t => {
  t.true(
    typeof createWithTheme === 'function',
    'createWithTheme should be a function',
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
    </context.Provider>,
  );

  t.true(typeof withTheme === 'function', 'withTheme should be a function')
})

test('should pass the default value of the context', (t) => {
  const theme = {}
  const context = React.createContext(theme)
  const WithTheme = createWithTheme(context)(FunctionalComponent)
  const {root} = TestRenderer.create(<WithTheme />)

  t.true(root.findByType(FunctionalComponent).props.theme === theme)
})

test('normal refs should just work and correctly be forwarded', t => {
  const context = React.createContext({});
  const WithTheme = createWithTheme(context)(ClassComponent);
  const innerRef = (comp: ClassComponent | null) => {
    t.deepEqual(comp?.inner, true);
  };

  TestRenderer.create(<WithTheme ref={innerRef} />);
});

test('withTheme(Comp) hoists non-react static class properties', (t) => {
  const context = React.createContext({})
  const withTheme = createWithTheme(context)
  const WithTheme = withTheme(ClassComponent)

  t.deepEqual(
    WithTheme.displayName,
    'WithTheme(foo)',
    'withTheme(Comp) should not hoist react static properties',
  );
  t.deepEqual(
    WithTheme.someSpecialStatic,
    ClassComponent.someSpecialStatic,
    'withTheme(Comp) should hoist non-react static properties',
  );
});

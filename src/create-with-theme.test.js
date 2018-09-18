// @flow

import test from 'ava';
import createReactContext from 'create-react-context';
import React from 'react';
import { mount } from 'enzyme';

import isFunction from 'is-function';
import createWithTheme from './create-with-theme';
import { Comp } from './test-helpers';

test(`createWithTheme's type`, t => {
  const actual = isFunction(createWithTheme);
  t.true(actual, `createWithTheme should be a function`);
});

test(`createWithTheme's result is function on its own`, t => {
  const context = createReactContext({});
  const withTheme = createWithTheme(context);
  const actual = isFunction(withTheme);
  t.true(actual, `withTheme should be a function`);
});

test('should pass the default value of the context', t => {
  const theme = {};
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp);
  const wrapper = mount(<WithTheme />);

  t.true(wrapper.find('Comp').prop('theme') === theme);
});


test('should pass the value of the Provider', t => {
  const theme = { test: 'test' };
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp);
  const wrapper = mount((
    <context.Provider value={theme}>
      <WithTheme />
    </context.Provider>
  ));

  t.true(wrapper.find('Comp').prop('theme') === theme);
});

test('should pass the theme as the specified prop', t => {
  const theme = { test: 'test' };
  const context = createReactContext(theme);
  const WithTheme = createWithTheme(context)(Comp, 'outerTheme');
  const wrapper = mount((
      <WithTheme />
  ));

  t.true(wrapper.find('Comp').prop('outerTheme') === theme);
});

test(`withTheme(Comp) hoists non-react static class properties`, t => {
  const context = createReactContext({});
  const withTheme = createWithTheme(context);
  class ExampleComponent extends React.Component<{}> {
    static displayName = 'foo';
    static someSpecialStatic = 'bar';
  }
  const ComponentWithTheme = withTheme(ExampleComponent);
  t.deepEqual(
    ComponentWithTheme.displayName,
    'WithTheme(foo)',
    `withTheme(Comp) should not hoist react static properties`,
  );
  t.deepEqual(
    // $FlowFixMe: Need to find a better way to type the hoist-non-react-statics
    ComponentWithTheme.someSpecialStatic,
    ExampleComponent.someSpecialStatic,
    `withTheme(Comp) should hoist non-react static properties`,
  );
});

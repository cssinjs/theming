import test from 'ava';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import createWithTheme from './create-with-theme';

type Props = {
  disabled: true;
  theme: {};
};

const FunctionalComponent = (_: Props) => null;

class ClassComponent extends React.Component<Props> {
  static displayName = 'foo';

  static someSpecialStatic = 'bar';

  inner = true;

  render() {
    return null;
  }
}

test('should pass the default value of the context', t => {
  const theme = {};
  const context = React.createContext(theme);
  const withTheme = createWithTheme(context);
  const WithTheme = withTheme<Props, typeof FunctionalComponent>(
    FunctionalComponent,
  );
  const { root } = TestRenderer.create(<WithTheme disabled={true} />);

  t.true(root.findByType(FunctionalComponent).props.theme === theme);
});

test('should pass the value of the Provider', t => {
  const context = React.createContext<{ test?: string }>({});
  const withTheme = createWithTheme(context);
  const WithTheme = withTheme<Props, typeof FunctionalComponent>(
    FunctionalComponent,
  );

  const theme = { test: 'test' };
  const { root } = TestRenderer.create(
    <context.Provider value={theme}>
      <WithTheme disabled={true} />
    </context.Provider>,
  );

  t.true(root.findByType(FunctionalComponent).props.theme === theme);
});

// test('normal refs should just work and correctly be forwarded', t => {
//   const context = React.createContext({});
//   const withTheme = createWithTheme(context);
//   const WithTheme = withTheme<Props, typeof ClassComponent>(ClassComponent);
//   const ref = React.createRef<ClassComponent>();

//   TestRenderer.create(<WithTheme ref={ref} />);

//   t.is(ref?.current?.inner, true);
// });

test('withTheme(Comp) hoists non-react static class properties', t => {
  const context = React.createContext({});
  const withTheme = createWithTheme(context);
  const WithTheme = withTheme<Props, typeof ClassComponent>(ClassComponent);

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

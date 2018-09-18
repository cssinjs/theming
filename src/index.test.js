import test from 'ava';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import isFunction from 'is-function';
import isPlainObject from 'is-plain-object';

import { createTheming } from './index';

configure({ adapter: new Adapter() });

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
  const expected = ['withTheme', 'ThemeProvider'];

  t.deepEqual(
    actual,
    expected,
    `createTheming()' keys are withTheme and ThemeProvider`,
  );
});

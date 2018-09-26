import test from 'ava';
import isObject from './is-object';

import { createTheming } from './index';


test(`createTheming's type`, t => {
  t.true(typeof createTheming === 'function', `createTheming should be a function`);
});

test(`createTheming()'s type`, t => {
  const theming = createTheming();
  const actual = isObject(theming);
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

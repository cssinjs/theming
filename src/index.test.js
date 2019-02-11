// @flow
import test from 'ava';
import { createContext } from 'react';

import isObject from './is-object';
import { createTheming } from '.';

test('createTheming\'s type', (t) => {
  t.true(typeof createTheming === 'function', 'createTheming should be a function');
});

test('createTheming()\'s type', (t) => {
  const context = createContext({});
  const theming = createTheming(context);
  const actual = isObject(theming);
  t.true(actual, 'createTheming() should be an object');
});

test('createTheming()\'s key names', (t) => {
  const context = createContext({});
  const theming = createTheming(context);
  const actual = Object.keys(theming);
  const expected = ['context', 'withTheme', 'useTheme', 'ThemeProvider'];

  t.deepEqual(
    actual,
    expected,
    'createTheming()\' keys are withTheme and ThemeProvider',
  );
});

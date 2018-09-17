// @flow

import test from 'ava';
import createReactContext from 'create-react-context';
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import isFunction from 'is-function';
import createWithTheme from './create-with-theme';

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

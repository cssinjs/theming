// @flow

import test from 'ava';
import createReactContext from 'create-react-context';
import React, { Component } from 'react';
import { mount } from 'enzyme';

import isFunction from 'is-function';
import createThemeProvider from './create-theme-provider';

test(`createThemeProvider's type`, t => {
  const actual = isFunction(createThemeProvider);
  t.true(actual, `createThemeProvider should be a function`);
});

test(`createThemeProvider's result instance type`, t => {
  const context = createReactContext({});
  const ThemeProvider = createThemeProvider(context);
  const actual = Component.isPrototypeOf(ThemeProvider);
  t.true(actual, `createThemeProvider() should be a React Component`);
});

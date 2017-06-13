# theming

[![Greenkeeper badge](https://badges.greenkeeper.io/iamstarkov/theming.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Unified CSSinJS theming solution for React

This package provides users and library authors with the necessary tooling to implement theming in React apps. Theming in React provides something of a challenge because your deeply nested components need access to the theme (and its changes) in order to know which styles to apply to themselves. You could use React's Context API, but it's unstable and passing changes down the components tree is unreliable.

Enter `theming`. The library provides a `withTheme` HOC which makes sure your theme is always available (and up to date) to the component it wraps. It does not matter how far down the components tree it is, nor does it matter if you use `PureComponent` or other ways of update blocking in between, the theme will always be available and up to date.

## Table of Contents

* [Install](#install)
* [Basic usage](#basic-usage)
* [Playground demo](#playground-demo)
* [API](#api)
  * [channel](#channel)
  * [ThemeProvider](#themeprovider)
  * [withTheme](#withthemecomponent)
  * [createTheming](#createthemingcustomchannel)
* [Credits](#credits)
* [License](#license)


## Install

    npm install --save theming
    # or
    yarn add theming


## Basic usage

To get the most basic use-case working, you need two things from this package:


* __`ThemeProvider` component__: pass your theme to this component and it will provide the theme to all sub-components that are wrapped with `withTheme`.
* __`withTheme` HOC__: wrap your components with this HOC and they will receive the `theme` prop that you provided to `ThemeProvider`.

### Example of a "themed" component


```jsx
import React from 'react';
import { withTheme } from 'theming';

const Button = props => {
  // props.theme was injected by "withTheme"
  // it affects the button's background color
  const style = { backgroundColor: props.theme.buttonColor };
  return (<button style={style}>Click me</button>);
}

export default withTheme(Button);
```

### Using it in your app

```jsx
import React from 'react';
import { ThemeProvider } from 'theming';
import Button from './components/Button'

const theme = {
  buttonColor: 'brown'
};

const App = () => (
  <ThemeProvider theme={theme}>
    <Button />
  </ThemeProvider>
)

export default App;
```

## Playground demo

Be our guest, play with `theming` in this webpackbin:
[https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1](https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1)

![theming playground demo](https://user-images.githubusercontent.com/559321/27082371-ba194816-5044-11e7-8f06-6cbdbdefb602.gif)

## API

### ThemeProvider

React High-Order component, which provides the theme object to descendants down the React tree.

```jsx
import { ThemeProvider } from 'theming';
const theme = { /*…*/ };

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

`ThemeProvider` components can also be nested. In this case the theme objects will get merged.


```jsx
const theme = { foo: 'foo', bar: 'bar' };
const subTheme = { bar: 'overwrite!', baz: 'baz' };

<ThemeProvider theme={theme}>
  <ThemeProvider theme={subTheme}>
    <App />
  </ThemeProvider>
</ThemeProvider>
```

In the example above, App and its children will receive the following theme object: `{ foo: 'foo', bar: 'overwrite!', baz: 'addbaz }`

#### props.theme
*Required*
  
Type: `PropTypes.object`, `PropTypes.function`

This is the theme that the `ThemeProvider`'s children will receive.

In case it's a function, the function will get called __WHEN?????__ and must return an object that contains the theme. If you do not return an object, `ThemeProvider` will throw an error.

For nested `ThemeProvider` instances that provide a function property as `theme`, the function will be called with the parent theme as first and only argument.

```jsx
const theme = { themed: true };
const augment = parentTheme =>
  Object.assign({}, parentTheme, { augmented: true });

<ThemeProvider theme={theme}>
  <ThemeProvider theme={augment}>
    <App /> {/* { themed: true, augmented: true } */}
  </ThemeProvider>
</ThemeProvider>
```

#### props.children
*Required*  

Type: `PropTypes.element`

`ThemeProvider` expects to receive a single child. It will throw an error if you pass more than one child.

### withTheme

__[TODO]__

### createTheming

__[TODO]__


### channel

__[TODO]__

## Credits

* Thanks to [jss][jss] creator [Oleg Slobodskoi @kof][kof] for immersive help, support and code review.
* Thanks to [styled-components][sc] creator [Max Stoiber @mxstbr][mxstbr] for initial and battle tested implementation of theming support in [styled-components][sc] as well as help and code review.
* Thanks to [styled-components'][sc] core team member [Phil Plückthun @philpl][philpl] for help and code review.
* Thanks to [glamorous][glamorous] creator [Kent C. Dodds @kentcdodds][kentcdodds] for help, support and code review.
* Thanks to [glamorous's][glamorous] core team member [Alessandro Arnodo @vesparny][vesparny] for improved theming support in [glamorous][glamorous] and [brcast][brcast].
* Thanks to [Gert Sallaerts @gertt][gertt] for the [playground][playground] demo.

[kof]: https://github.com/kof
[mxstbr]: https://github.com/mxstbr
[philpl]: https://github.com/philpl
[kentcdodds]: https://github.com/kentcdodds
[vesparny]: https://github.com/vesparny
[gertt]: https://github.com/gertt

[jss]: https://github.com/cssinjs/jss
[sc]: https://github.com/styled-components/styled-components
[glamorous]: https://github.com/paypal/glamorous
[brcast]: https://github.com/vesparny/brcast
[playground]: https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/theming
[npm-image]: https://img.shields.io/npm/v/theming.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/theming
[travis-image]: https://img.shields.io/travis/iamstarkov/theming.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/iamstarkov/theming
[coveralls-image]: https://img.shields.io/coveralls/iamstarkov/theming.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/theming
[depstat-image]: https://david-dm.org/nordnet/grid.svg?style=flat-square

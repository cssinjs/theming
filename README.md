# theming

[![NPM version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Theming High-Order Components toolkit

## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [API](#api)
  * [channel](#channel)
  * [ThemeProvider](#themeprovider)
  * [withTheme](#withtheme)
  * [createTheming](#createtheming)
* [License](#license)


## Install

    npm install --save theming
    # or
    yarn add theming


## Usage

In your components

Note: this component i will use later to show what theme you will get

```jsx
import React from 'react';
import { withTheme } from 'theming';

const DemoBox = props => {
  console.log(props.theme);
  return (<div />);
}

export default withTheme(DemoBox);
```

In your app

```jsx
import React from 'react';
import { ThemeProvider } from 'theming';
import DemoBox from './components/DemoBox'

const theme = {
  color: 'black',
  background: 'white',
};

const App = () => (
  <ThemeProvider theme={theme}>
    <DemoBox /> {/* { color: 'black', background: 'white' } */}
  </ThemeProvider>
)

export default App;
```

## API

### channel

Theming package by default uses this string as a name of the field in context (hence `contextTypes` and `childContextTypes`). If you want to build your own components on top of theming, it might be a good idea to not rely on hard coded value, but instead import this value from the package.

```js
import { channel } from 'theming';

console.log(channel); '__THEMING__';
```

### ThemeProvider

React High-Order component, which passes theme object down the react tree by context.

```jsx
import { ThemeProvider } from 'theming';
const theme = { /*…*/ };

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

#### props

##### props.theme

*Required*  
Type: `Object`, `Function`

If its `Object` and its root `ThemeProvider` then its intact and being passed down the react tree.

```jsx
const theme = { themed: true };

<ThemeProvider theme={theme}>
  <DemoBox /> {/* { themed: true } */}
</ThemeProvider>
```

If its `Object` and its nested `ThemeProvider` then its being merged with theme from parent `ThemeProvider` and passed down to the react tree.

```jsx
const theme = { themed: true };
const patch = { merged: true };

<ThemeProvider theme={theme}>
  <ThemeProvider theme={patch}>
    <DemoBox /> {/* { themed: true, merged: true } */}
  </ThemeProvider>
</ThemeProvider>
```

If its `Function` and its nested `ThemeProvider` then its being applied to the theme from parent `ThemeProvider`. if result is an `Object` it will be passed down to the react tree, throws otherwise.

```jsx
const theme = { themed: true };
const augment = outerTheme =>
  Object.assign({}, outerTheme, { augmented: true });

<ThemeProvider theme={theme}>
  <ThemeProvider theme={augment}>
    <DemoBox /> {/* { themed: true, augmented: true } */}
  </ThemeProvider>
</ThemeProvider>
```

##### props.children

*Required*  
Type: `PropTypes.elemenwt`

ThemeProvider uses [`React.Children.only`](https://facebook.github.io/react/docs/react-api.html#react.children.only) in render, which returns the only child in children. Throws otherwise.

### withTheme(component)

React High-Order component, which maps context to theme prop.

#### component

*Required*  
Type: `PropTypes.element`

You need to have `ThemeProvider` with a theme somewhere upper the react tree, after that wrap you component in `withTheme` and your component will get theme as prop.1 `withTheme` will handle initial theme object as well as theme updates.


PS. It doesnt break if you have `PureComponent` somewhere in between your ThemeProvider and withTheme (i have tests for that).

Usage with Component:

```jsx
import React from 'react';
import { withTheme } from 'theming';

const DemoBox = props => {
  console.log(props.theme);
  return (<div />);
}

export default withTheme(DemoBox);
```

In the app:

```jsx
import React from 'react';
import { ThemeProvider } from 'theming';
import DemoBox from './components/DemoBox'

const theme = {
  color: 'black',
  background: 'white',
};

const App = () => (
  <ThemeProvider theme={theme}>
    <DemoBox /> {/* { color: 'black', background: 'white' } */}
  </ThemeProvider>
)

export default App;
```

### createTheming(customChannel)

Function to create `ThemeProvider` and `withTheme` with custom context channel.

#### customChannel

Type: `String`  
Default: `__THEMING__`
Result: `Object { channel, withTheme, ThemeProvider }`

`withTheme` and `ThemeProvider` are the same as default ones, but with overwritten context channel.

`channel` is `customChannel` to track what is context channel.

```js
import { createTheming } from 'theming';

const theming = createTheming('__styled-components__');

const { channel, withTheme, ThemeProvider } = theming;

export default {
  channel,
  withTheme,
  ThemeProvider,
};
```

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

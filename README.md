# theming

[![NPM version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Theming High-Order Components toolkit

## Install

    npm install --save theming
    # or
    yarn add theming

## Usage

In your components

Note: this component i will use later to show what theme you will get
```js
import React from 'react';
import { withTheme } from 'theming';

const DemoBox = props => {
  console.log(props.theme);
  return (<div />);
}

export default withTheme(DemoBox);
```

In your app

```js
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

## channel

Theming package by default uses this string as a name of the field in context (hence `contextTypes` and `childContextTypes`). If you want to build your own components on top of theming, it might be a good idea to not rely on hard coded value, but instead import this value from the package.

```
import { channel } from 'theming';

console.log(channel); '__THEMING__';
```

### ThemeProvider

React High-Order component, which passes theme object down the react tree by context.

```
import { ThemeProvider } from 'theming';
const theme = { /*…*/ };

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### props

#### props.theme

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

#### props.children

*Required*  
Type: `PropTypes.element`

ThemeProvider uses [`React.Children.only`](https://facebook.github.io/react/docs/react-api.html#react.children.only) in render, which returns the only child in children. Throws otherwise.


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

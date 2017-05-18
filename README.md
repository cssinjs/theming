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

```js
import React from 'react';
import { withTheme } from 'theming';

const prettyPrint = value => JSON.stringify(value, null, 2);

const DemoBox = props => <pre>{ prettyPrint(props.theme) }</pre>

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
    <DemoBox />
  </ThemeProvider>
)

export default App;
```

## API

### ThemeProvider

React High-Order component, which passes theme object down the react tree by context.

```
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### props

#### props.theme

*Required*  
Type: `Object`, `Function`

If its `Object` and its root `ThemeProvider` then its intact and being passed down the react tree.

If its `Object` and its nested `ThemeProvider` then its being merged with theme from parent `ThemeProvider` and passed down to the react tree.

If its `Function` and its nested ThemeProvider then its being applied to the theme from parent ThemeProvider and if result is an object it will be passed down to the react tree.


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

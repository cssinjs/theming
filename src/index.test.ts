import test from 'ava';
import { createContext } from 'react';

import { createTheming } from '.';

test("createTheming()'s key names", t => {
  const context = createContext({});
  const theming = createTheming(context);

  t.deepEqual(Object.keys(theming), [
    'context',
    'withTheme',
    'useTheme',
    'ThemeProvider',
  ]);
  t.is(theming.context, context);
});

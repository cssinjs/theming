import test from 'ava';
import isPlainObject from 'is-plain-object';
import isFunction from 'is-function';
import createBroadcast from './create-broadcast';

test(`createBroadcast's type`, t => {
  t.true(isFunction(createBroadcast), `createBroadcast should be a function`);
});

test(`createBroadcast result type`, t => {
  const broadcast = createBroadcast();
  t.true(
    isPlainObject(broadcast),
    `createBroadcast() should be a plain object`,
  );
});

test(`createBroadcast result keys`, t => {
  const broadcast = createBroadcast();

  t.deepEqual(
    Object.keys(broadcast),
    ['publish', 'subscribe'],
    `createBroadcast() should have publish and subscribe methods`,
  );
});

test(`publish/subscribe types`, t => {
  const broadcast = createBroadcast();
  const { publish, subscribe } = broadcast;
  const actual = [publish, subscribe].every(isFunction);
  t.true(actual, `createBroadcast() should have publish and subscribe methods`);
});

test(`emit initial value to subscriber from the start`, t => {
  const EXPECTED_VALUE = 'EXPECTED_VALUE';
  const broadcast = createBroadcast(EXPECTED_VALUE);
  let ACTUAL_VALUE;
  const listener = x => (ACTUAL_VALUE = x);
  broadcast.subscribe(listener);
  t.is(ACTUAL_VALUE, EXPECTED_VALUE, `listener should get initial value`);
});

test(`emit new value to subscriber`, t => {
  const broadcast = createBroadcast();
  const EXPECTED_VALUE = 'EXPECTED_VALUE';
  let ACTUAL_VALUE;
  const listener = x => (ACTUAL_VALUE = x);
  broadcast.subscribe(listener);
  broadcast.publish(EXPECTED_VALUE);
  t.is(ACTUAL_VALUE, EXPECTED_VALUE, `listener should get emitted value`);
});

test(`emit new value to all subscribers`, t => {
  const broadcast = createBroadcast();
  const EXPECTED_VALUE = 'EXPECTED_VALUE';
  let ACTUAL_VALUE_1;
  let ACTUAL_VALUE_2;
  const listener1 = x => (ACTUAL_VALUE_1 = x);
  const listener2 = x => (ACTUAL_VALUE_2 = x);

  broadcast.subscribe(listener1);
  broadcast.subscribe(listener2);
  broadcast.publish(EXPECTED_VALUE);
  t.true(
    [ACTUAL_VALUE_1, ACTUAL_VALUE_2].every(x => x === EXPECTED_VALUE),
    `all listeners should get the same emitted value`,
  );
});

test(`dont emit new value to removed subscribers`, t => {
  const broadcast = createBroadcast();
  const EXPECTED_VALUE = 'EXPECTED_VALUE';
  const UNEXPECTED_VALUE = 'UNEXPECTED_VALUE';

  let ACTUAL_VALUE;

  const listener = x => (ACTUAL_VALUE = x);

  const unsubscribe = broadcast.subscribe(listener);

  broadcast.publish(EXPECTED_VALUE);
  unsubscribe();
  broadcast.publish(UNEXPECTED_VALUE);

  t.is(
    ACTUAL_VALUE,
    EXPECTED_VALUE,
    `listener shoult get last emiited value before unsubscribing`,
  );

  t.not(
    ACTUAL_VALUE,
    UNEXPECTED_VALUE,
    `listener shoult not get value emiited after unsubscribing`,
  );
});

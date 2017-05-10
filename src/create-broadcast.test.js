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

  t.true(
    Object.values(broadcast).every(isFunction),
    `createBroadcast() should have publish and subscribe methods`,
  );
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
  const EXPECTED_VALUE_1 = 'EXPECTED_VALUE_1';
  const EXPECTED_VALUE_2 = 'EXPECTED_VALUE_2';
  const EXPECTED_VALUE_3 = 'EXPECTED_VALUE_3';
  const EXPECTED_VALUE_4 = 'EXPECTED_VALUE_4';

  let ACTUAL_VALUE_1;
  let ACTUAL_VALUE_2;
  let ACTUAL_VALUE_3;

  const listener1 = x => (ACTUAL_VALUE_1 = x);
  const listener2 = x => (ACTUAL_VALUE_2 = x);
  const listener3 = x => (ACTUAL_VALUE_3 = x);

  const unsubscribe1 = broadcast.subscribe(listener1);
  const unsubscribe2 = broadcast.subscribe(listener2);
  const unsubscribe3 = broadcast.subscribe(listener3);

  broadcast.publish(EXPECTED_VALUE_1);
  unsubscribe1();
  broadcast.publish(EXPECTED_VALUE_2);
  unsubscribe2();
  broadcast.publish(EXPECTED_VALUE_3);
  unsubscribe3();
  broadcast.publish(EXPECTED_VALUE_4);

  t.deepEqual(
    [ACTUAL_VALUE_1, ACTUAL_VALUE_2, ACTUAL_VALUE_3],
    [EXPECTED_VALUE_1, EXPECTED_VALUE_2, EXPECTED_VALUE_3],
    `all listeners should get the same emitted value after first publish`,
  );
});

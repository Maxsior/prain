import { test } from 'mocha';
import assert from 'node:assert/strict'
import _p from './index';

test('function wrapper', async () => {
  function foo() { return 'ok' }

  const result = _p(foo)();

  assert.equal(result, 'ok');
});

test('async function wrapper', async () => {
  async function foo() { return 'ok' }

  const result = await _p(foo)();

  assert.equal(result, 'ok');
});

test('object wrapper', async () => {
  const O = {
    async foo() {
      return 'foo';
    },
    bar() {
      return 'bar'
    }
  };

  const resultAsync = await _p(O).foo();
  const resultSync = _p(O).bar();

  assert.equal(resultAsync, 'foo');
  assert.equal(resultSync, 'bar');
});

test('full async method chain', async () => {
  const O = {
    async first() {
      return {
        async second() {
          return {
            async third() {
              return 'ok';
            }
          }
        }
      }
    }
  };

  const result = await _p(O).first().second().third();

  assert.equal(result, 'ok');
});

test('full async function chain', async () => {
  const foo = async () => async () => 'ok';

  const result = await _p(foo)()();

  assert.equal(result, 'ok');
});

test('promise fields', async () => {
  const O = {
    foo: Promise.resolve({
      bar: Promise.resolve({
        baz: 'ok'
      }),
    }),
  };

  const result = await _p(O).foo.bar.baz;

  assert.equal(result, 'ok');
});

test('different promises', async () => {
  function monster() {
    return {
      async async_method() {
        return {
          sync_field: {
            async async_method() {
              return async function async_function() {
                return 'ok';
              }
            }
          }
        }
      }
    }
  }

  const result = await _p(monster)().async_method().sync_field.async_method()();

  assert.equal(result, 'ok');
});

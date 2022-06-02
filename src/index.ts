import { types } from 'util';
import { Depromisify } from './types';

function isFunction(obj: any): obj is (...args: any) => any {
  return typeof obj === 'function';
}

function isPromise(obj: any): obj is Promise<unknown> {
  return types.isPromise(obj);
}

function isObject(obj: any): obj is object {
  return obj !== null && typeof obj === 'object';
}

function prain<T>(obj: T): Depromisify<T> {
  if (isFunction(obj)) {
    return new Proxy(obj, {
      apply(target, thisArg, argArray) {
        const result = Reflect.apply(target, thisArg, argArray);
        // @ts-ignore TS2589
        return prain(result);
      }
    }) as Depromisify<T>;
  }

  if (isPromise(obj)) {
    return new Proxy(() => null, {
      get(_, prop, receiver) {
        if (prop === 'then') {
          return obj.then.bind(obj);
        }

        return prain(obj.then((p) => {
          return Reflect.get(p as object, prop, receiver);
        }));
      },
      apply(_, thisArg, argArray) {
        return prain(obj.then((p) => {
          return Reflect.apply(p as Function, thisArg, argArray);
        }));
      },
    }) as Depromisify<T>;
  }

  if (isObject(obj)) {
    return new Proxy(obj, {
      get(target, prop, receiver) {
        const result = Reflect.get(target, prop, receiver);
        return prain(result);
      }
    }) as Depromisify<T>;
  }

  return obj as Depromisify<T>;
}

export default prain;

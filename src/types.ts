type DepromisifyObject<T extends object> = {
  [P in keyof T]: Depromisify<T[P]>
};

export type Depromisify<T> =
  T extends (...args: infer A) => infer R
    ? (...args: A) => Depromisify<R>
    : T extends Promise<any>
      ? Depromisify<Awaited<T>>
      : T extends object
        ? DepromisifyObject<Awaited<T>>
        : Promise<T>;

export type Fn<TArgs = never, TReturn = void> = TArgs extends any[]
    ? (...args: TArgs) => TReturn
    : TArgs extends never
    ? () => TReturn
    : (args: TArgs) => TReturn;

export type Nullable<T> = T | null | undefined;
export type KeyOf<T> = Exclude<keyof T, number | symbol>;
export type StripNever<T extends Record<string, unknown>> = {
    [TKey in keyof T as T[TKey] extends never ? never : TKey]: T[TKey];
};

export type Nullable<T> = T | null | undefined;
export type KeyOf<T> = Exclude<keyof T, number | symbol>;
export type StripNever<T extends Record<string, unknown>> = {
    [TKey in keyof T as T[TKey] extends never ? never : TKey]: T[TKey];
};

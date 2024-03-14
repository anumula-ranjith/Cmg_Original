export type VoidFn = () => void;
export type VoidPromise = () => Promise<void>;
export type VoidPromiseLike = VoidFn | VoidPromise;

export type AnyFn = () => unknown;
export type AnyPromise = () => Promise<unknown>;
export type AnyPromiseLike = VoidFn | VoidPromise;

export type Noop = () => void;
export type PromiseNoop = () => Promise<void>;
export type AnyNoop = Noop | PromiseNoop;

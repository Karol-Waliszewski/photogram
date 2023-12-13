import { type ComponentProps, type JSXElementConstructor } from "react";

export type TypedOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type InferProps<
  T extends JSXElementConstructor<unknown> | keyof JSX.IntrinsicElements,
  O extends keyof ComponentProps<T> | "" = "",
> = Omit<ComponentProps<T>, O>;

export type RemoveOptional<T extends object> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined> extends object
    ? RemoveOptional<Exclude<T[P], null | undefined>>
    : Exclude<T[P], null | undefined>;
};
export type AddOptional<T extends object> = {
  [P in keyof T]+?: T[P] extends object
    ? AddOptional<T[P]>
    : T[P] | null | undefined;
};

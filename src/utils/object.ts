export const keys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>;

export const values = <T extends object>(obj: T): Array<T[keyof T]> =>
  keys(obj).map((key) => obj[key]);

export const isObject = (obj: unknown) =>
  typeof obj === "object" && !Array.isArray(obj) && obj !== null;

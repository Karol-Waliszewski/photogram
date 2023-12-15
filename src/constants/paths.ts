export const publicPaths = ["/"] as const;
export const protectedPaths = ["/profile", "/following"] as const;
export const paths = [...publicPaths, ...protectedPaths];

export type ReplaceWildcard<T extends string> =
  T extends `${infer Start}[${string}]${infer End}`
    ? `${Start}${string}${ReplaceWildcard<End>}`
    : T;

export type PublicPaths = ReplaceWildcard<(typeof publicPaths)[number]>;
export type ProtectedPaths = ReplaceWildcard<(typeof protectedPaths)[number]>;
export type Paths = PublicPaths | ProtectedPaths;

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile", "/following"], // Remember to update protected paths in @/constants/paths
};

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { cn } from "@/utils/cn";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        html {
          font-family:
            ${fontSans.style.fontFamily},
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            "Helvetica Neue",
            Arial,
            "Noto Sans",
            sans-serif,
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            "Noto Color Emoji";
        }
      `}</style>
      <SessionProvider session={session}>
        <div className={cn("font-sans", fontSans.variable)}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

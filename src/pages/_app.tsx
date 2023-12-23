import { SessionProvider } from "next-auth/react";
import { Inter as FontSans } from "next/font/google";
import { Provider as StoreProvider } from "jotai";
import { type Session } from "next-auth";
import { type AppType } from "next/app";

import { Toaster } from "@/components/organisms/Toaster";

import { api } from "@/utils/api";
import { cn } from "@/utils/cn";

import "@/styles/globals.css";

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
        <StoreProvider>
          <div className={cn("font-sans", fontSans.variable)}>
            <Component {...pageProps} />
            <Toaster />
          </div>
        </StoreProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);

import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="en">
      <Head />
      <body className={"dark:dark min-h-screen font-sans antialiased"}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

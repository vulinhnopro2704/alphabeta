import type { Metadata } from "next";
import StoreProvider from "./store-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider count={1}>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

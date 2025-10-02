import type { Metadata } from "next";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";
import { Banner } from "@/components/Banner";

export const metadata: Metadata = {
  title: {
    template: "%s | mono",
    default: "mono",
  },
  description: "A task management app only for myself",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout(props: Readonly<Props>) {
  const { children } = props;

  return (
    <ViewTransition name="auto">
      <html lang="ja">
        <body className="">
          <Banner />

          <main className="lg:max-w-lg mx-auto px-2">
            {children}
          </main>
        </body>
      </html>
    </ViewTransition>
  );
}

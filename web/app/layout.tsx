import type { Metadata } from "next";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";
import { Banner } from "@/components/Banner";
import { Complementary } from "@/components/Complementary";

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
        <body className="h-full bg-amber-50 dark:bg-zinc-950 dark:text-white">
          <div className="flex h-full">
            <aside className="hidden md:block border-r-2 w-[200px]">
              <Complementary />
            </aside>

            <div className="grow h-full">
              <Banner />

              <main className="px-2 my-4 max-w-lg mx-auto">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </ViewTransition>
  );
}

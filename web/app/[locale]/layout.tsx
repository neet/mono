import { ViewTransition } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import "./globals.css";
import { routing } from "@/i18n/routing";
import { Banner } from "@/components/Banner";
import { Complementary } from "@/components/Complementary";

export const metadata: Metadata = {
  title: {
    template: "%s | mono",
    default: "mono",
  },
  description: "A task management app only for myself",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  const { children } = props;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <ViewTransition name="auto">
      <html lang={locale}>
        <body className="h-full bg-amber-50 dark:bg-zinc-950 dark:text-white">
          <NextIntlClientProvider>
            <div className="flex h-full">
              <aside className="hidden md:block border-r-2 w-[200px]">
                <Complementary />
              </aside>

              <div className="grow h-full">
                <Banner />

                <main className="px-2 my-4 max-w-lg mx-auto">{children}</main>
              </div>
            </div>
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransition>
  );
}

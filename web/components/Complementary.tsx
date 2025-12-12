import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FC } from "react";
import NextLink from "next/link";

import { Link, getPathname } from "@/i18n/navigation";

export type ComplementaryProps = {
  className?: string;
};

export const Complementary: FC<ComplementaryProps> = (props) => {
  const t = useTranslations("components.Complementary");
  const { className } = props;

  return (
    <div className={clsx("flex flex-col h-full", className)}>
      <nav className="grow p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/" className="flex gap-1 items-center hover:underline">
              <CheckIcon className="size-5" />
              {t("tasks")}
            </Link>
          </li>
          <li>
            <Link
              href="/habits"
              className="flex gap-1 items-center hover:underline"
            >
              <ArrowPathIcon className="size-5" />
              {t("habits")}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="p-4">
        <ul className="flex flex-wrap gap-2 text-sm">
          <li>
            <NextLink
              href={getPathname({ href: "/", locale: "en" })}
              className="underline"
            >
              English
            </NextLink>
          </li>
          <li>
            <NextLink
              href={getPathname({ href: "/", locale: "ja" })}
              className="underline"
            >
              日本語
            </NextLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

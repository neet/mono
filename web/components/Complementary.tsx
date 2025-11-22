import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { FC } from "react";

import { Link } from "@/i18n/navigation";

export type ComplementaryProps = {
  className?: string;
};

export const Complementary: FC<ComplementaryProps> = (props) => {
  const t = useTranslations("components.Complementary");
  const { className } = props;

  return (
    <nav className={clsx("p-4", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/" className="flex gap-1 items-center hover:underline">
            <CheckIcon className="size-5" />
            {t("tasks")}
          </Link>
        </li>
        <li>
          <Link href="/habits" className="flex gap-1 items-center hover:underline">
            <ArrowPathIcon className="size-5" />
            {t("habits")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

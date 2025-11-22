import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FC } from "react";

export type TabBarProps = {
  pending?: boolean;
  className?: string;
}

const LINK_CLASS = "w-full py-1 text-center hover:underline"
const LINK_ACTIVE_CLASS = "bg-zinc-950 text-white dark:text-black dark:bg-amber-50"

export const TabBar: FC<TabBarProps> = (props) => {
  const t = useTranslations("components.TabBar");
  const { pending, className } = props;

  return (
    <div className={clsx("flex justify-around border-2 rounded divide-x-2", className)}>
      <Link
        href="/tasks?status=pending"
        className={clsx(LINK_CLASS, pending && LINK_ACTIVE_CLASS)}
      >
        {t("pending")}
      </Link>

      <Link
        href="/tasks?status=completed&status=canceled"
        className={clsx(LINK_CLASS, !pending && LINK_ACTIVE_CLASS)}
      >
        {t("done")}
      </Link>
    </div>
  );
}

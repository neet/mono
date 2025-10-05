import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";

export type ComplementaryProps = {
  className?: string;
};

export const Complementary: FC<ComplementaryProps> = (props) => {
  const { className } = props;

  return (
    <nav className={clsx("p-4", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/" className="flex gap-1 items-center hover:underline">
            <CheckIcon className="size-5" />
            タスク
          </Link>
        </li>
        <li>
          <Link href="/habits" className="flex gap-1 items-center hover:underline">
            <ArrowPathIcon className="size-5" />
            習慣
          </Link>
        </li>
      </ul>
    </nav>
  );
};

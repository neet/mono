import clsx from "clsx";
import { FC } from "react";

import { Link } from "@/i18n/navigation";
import { BannerMenu } from "./BannerMenu";

export type BannerProps = {
  className?: string;
};

export const Banner: FC<BannerProps> = (props) => {
  const { className } = props;

  return (
    <header className={clsx("border-b-2", className)}>
      <div className="flex justify-between items-center lg:max-w-lg mx-auto px-2">
        <Link href="/" className="py-1 grow">
          <h1 className="text-2xl font-serif font-bold hover:underline">
            mono
          </h1>
        </Link>

        <BannerMenu className="md:hidden" />
      </div>
    </header>
  );
};

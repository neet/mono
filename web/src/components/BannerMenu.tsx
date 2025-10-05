"use client";

import { FC, useRef } from "react";
import { Complementary } from "./Complementary";
import { Bars3Icon } from "@heroicons/react/16/solid";

type BannerMenuProps = {
  className?: string;
}

export const BannerMenu: FC<BannerMenuProps> = (props) => {
  const { className } = props;
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button className={className} onClick={() => ref.current?.showModal()}>
        <Bars3Icon className="size-4" />
      </button>

      <dialog ref={ref} className="bg-amber-50 backdrop:backdrop-blur-md backdrop:bg-black/70 w-full m-2 h-full rounded border-2">
        <Complementary />
      </dialog>
    </>
  )
}

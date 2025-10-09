"use client";

import { FC, useRef, useCallback, MouseEventHandler } from "react";
import { Complementary } from "./Complementary";
import { Bars3Icon } from "@heroicons/react/16/solid";

type BannerMenuProps = {
  className?: string;
}

export const BannerMenu: FC<BannerMenuProps> = (props) => {
  const { className } = props;
  const ref = useRef<HTMLDialogElement>(null);

  const handleClick: MouseEventHandler = useCallback((e) => {
    if (e.target !== e.currentTarget) {
      ref.current?.close();
    }
  }, []);

  return (
    <>
      <button className={className} onClick={() => ref.current?.showModal()}>
        <Bars3Icon className="size-4" />
      </button>

      <dialog
        ref={ref}
        className="absolute top-0 left-0 backdrop:backdrop-blur-md backdrop:bg-black/70 bg-transparent p-2 w-full h-full max-w-full max-h-full"
        onClick={handleClick}
      >
        <Complementary className="bg-amber-50 dark:bg-slate-950 dark:text-white rounded border-2" />
      </dialog>
    </>
  )
}

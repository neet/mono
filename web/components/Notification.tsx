import { FC, ReactNode } from "react";
import { CheckIcon } from "@heroicons/react/16/solid";

export type NotificationProps = {
  children: ReactNode;
}

export const Notification: FC<NotificationProps> = (props) => {
  const { children } = props;
  
  return (
    <div className="flex gap-1 items-center p-2 rounded bg-emerald-400 dark:bg-emerald-600">
      <CheckIcon className="size-4" />
      {children}
    </div>
  );
}


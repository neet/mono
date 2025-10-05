import clsx from "clsx";
import { ComponentProps, FC } from "react";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary";
};

export const Button: FC<ButtonProps> = (props) => {
  const { className, children, variant, ...rest } = props;

  return (
    <button
      {...rest}
      className={clsx(
        "px-3 py-1 border-2 rounded",
        variant === "primary" && "bg-emerald-400 dark:bg-emerald-600",
        className
      )}
    >
      {children}
    </button>
  );
};

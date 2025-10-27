import { FC, ReactNode } from "react";

export type ControllerProps = {
  label: string;
  id: string;
  children: (props: { id: string, className?: string }) => ReactNode;
};

export const Controller: FC<ControllerProps> = (props) => {
  const { label, id, children } = props;

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block font-bold"
      >
        {label}
      </label>

      {children({ id })}
    </div>
  );
};

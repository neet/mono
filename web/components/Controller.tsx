import { FC, ReactNode } from "react";

export type ControllerProps = {
  label: string;
  id: string;
  children: (props: { id: string, className: string }) => ReactNode;
};

export const Controller: FC<ControllerProps> = (props) => {
  const { label, id, children } = props;

  return (
    <div className="border-2 rounded">
      <label
        htmlFor={id}
        className="block border-dashed border-b-2 p-2 text-sm font-bold"
      >
        {label}
      </label>

      {children({ id, className: "p-2 w-full" })}
    </div>
  );
};

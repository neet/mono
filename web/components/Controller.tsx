import { FC, ReactNode } from "react";

export type ChildrenProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string;
};

export type ControllerProps = {
  id: string;
  label: string;
  errors?: string[];
  children: (props: ChildrenProps) => ReactNode;
};

export const Controller: FC<ControllerProps> = (props) => {
  const { label, id, errors = [], children } = props;

  const descriptionId = `${id}-description`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>

      {children({
        id,
        "aria-describedby": descriptionId,
        "aria-invalid": errors.length > 0,
      })}

      {errors.length > 0 && (
        <ul id={descriptionId} className="text-red-600 dark:text-red-400">
          {errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

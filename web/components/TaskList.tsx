import { FC } from "react";
import { clsx } from "clsx";
import { getTranslations } from "next-intl/server";

import { Task } from "../models/task";
import { TaskListItem } from "./TaskListItem";

export type TaskProps = {
  readonly tasks: readonly Task[];
  readonly className?: string;
};

export const TaskList: FC<TaskProps> = async (props) => {
  const { tasks, className } = props;
  const t = await getTranslations("components.TaskList");

  return (
    <div className={clsx("border-2 rounded", className)}>
      {tasks.length === 0 && (
        <div className="p-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            {t("empty")}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="divide-dashed divide-y-2">
          {tasks.map((task) => (
            <TaskListItem className="p-2" key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

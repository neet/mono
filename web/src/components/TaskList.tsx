import { FC } from "react";
import { clsx } from "clsx";

import { Task } from "../models/task";
import { TaskListItem } from "./TaskListItem";

export type TaskProps = {
  readonly tasks: readonly Task[];
  readonly className?: string;
}

export const TaskList: FC<TaskProps > = (props) => {
  const { tasks, className } = props;

  return (
    <div className={clsx("border-2 border-black rounded", className)}>
      <div className="divide-black divide-dashed divide-y-2">
        {tasks.map((task) => (
          <TaskListItem className="p-2" key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

import { FC } from "react";
import clsx from "clsx";
import { revalidatePath } from "next/cache";
import { Task } from "@/models/task";
import { CheckIcon } from "@heroicons/react/16/solid";
import { api } from "@/api";
import Link from "next/link";

export type TaskListItemProps = {
  readonly task: Task;
  readonly className?: string;
}

export const TaskListItem: FC<TaskListItemProps> = (props) => {
  const { task, className } = props;

  const complete = async (fd: FormData) => {
    "use server";
    const completed = fd.get("completed") === "on";
    await api.tasks.update(task.id, { completed });
    revalidatePath("/");
  };

  return (
    <div className={clsx("flex gap-2 items-center", className)} style={{ viewTransitionName: `task-${task.id}` }}>
      <form action={complete} className="contents">
        <input type="hidden" name="completed" value={task.completed ? "off" : "on"} />

        <button type="submit" className={
          clsx(
            "cursor-pointer",
            task.completed && "bg-[#20DA91] rounded border-2 p-0.5",
            !task.completed && "rounded border-2 p-0.5"
          )
        }>
          <div className="size-4">
            {
              task.completed && <CheckIcon />
            }
          </div>
          

          <div className="sr-only">
            完了
          </div>
        </button>
      </form>

      <div style={{ viewTransitionName: `task-${task.id}-title` }}>
        <Link href={`/tasks/${task.id}`} className="hover:underline">
          {task.title}
        </Link>
      </div>
    </div>
  );
}

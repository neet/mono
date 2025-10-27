import { FC } from "react";
import clsx from "clsx";
import { revalidatePath } from "next/cache";
import { Task } from "@/models/task";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
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
    const status = fd.get("status");

    if (typeof status !== "string") {
      return;
    }

    await api.tasks.update(task.id, { status });
    revalidatePath("/");
  };

  const nextStatus = task.status === "pending"
    ? "completed"
    : "pending";

  return (
    <div className={clsx("flex gap-2 items-center", className)} style={{ viewTransitionName: `task-${task.id}` }}>
      <form action={complete} className="contents">
        <input type="hidden" name="status" value={nextStatus} />

        <button type="submit" className={
          clsx(
            "cursor-pointer",
            (task.status === "completed" || task.status === "canceled") && "bg-emerald-400 dark:bg-emerald-600 rounded border-2 p-0.5",
            task.status === "pending" && "rounded border-2 p-0.5"
          )
        }>
          <div className="size-4">
            {
              task.status === "completed" && <CheckIcon />
            }
            {
              task.status === "canceled" && <XMarkIcon />
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

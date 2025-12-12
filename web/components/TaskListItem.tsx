import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { FC } from "react";
import clsx from "clsx";
import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { Task } from "@/models/task";
import { api } from "@/api";
import { Link } from "@/i18n/navigation";

export type TaskListItemProps = {
  readonly task: Task;
  readonly className?: string;
};

export const TaskListItem: FC<TaskListItemProps> = async (props) => {
  const { task, className } = props;
  const locale = await getLocale();
  const t = await getTranslations("components.TaskListItem");

  const complete = async (fd: FormData) => {
    "use server";
    const status = fd.get("status");

    if (typeof status !== "string") {
      return;
    }

    await api.tasks.update(task.id, { status });
    revalidatePath(`/${locale}`);
  };

  const nextStatus = task.status === "pending" ? "completed" : "pending";

  const deadlineOn = task.deadline_on
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(task.deadline_on),
      )
    : null;

  return (
    <div
      className={clsx("flex gap-2 items-center", className)}
      style={{ viewTransitionName: `task-${task.id}` }}
    >
      <form action={complete} className="contents">
        <input type="hidden" name="status" value={nextStatus} />

        <button
          type="submit"
          className={clsx(
            "cursor-pointer",
            (task.status === "completed" || task.status === "canceled") &&
              "bg-emerald-400 dark:bg-emerald-600 rounded border-2 p-0.5",
            task.status === "pending" && "rounded border-2 p-0.5",
          )}
        >
          <div className="size-4">
            {task.status === "completed" && <CheckIcon />}
            {task.status === "canceled" && <XMarkIcon />}
          </div>

          <div className="sr-only">{t("complete")}</div>
        </button>
      </form>

      <div style={{ viewTransitionName: `task-${task.id}-title` }}>
        <Link href={`/tasks/${task.id}`} className="hover:underline">
          {task.title}
        </Link>

        {deadlineOn && (
          <div className="text-zinc-600 dark:text-zinc-400">
            <time dateTime={task.deadline_on ?? undefined}>{deadlineOn}</time>
          </div>
        )}
      </div>
    </div>
  );
};

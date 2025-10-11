import type { Metadata } from "next";
import { redirect } from "next/navigation";
import clsx from "clsx";

import { api } from "@/api";
import { Task } from "@/models/task";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { TextareaAutosize } from "@/components/TextareaAutosize"

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { id } = await props.params;
  const task: Task = await api.tasks.get(id);

  return {
    title: task.title,
  };
};

export default async function TasksIdPage(props: Props) {
  const { id } = await props.params;
  const task: Task = await api.tasks.get(id);

  const timestamp = new Intl.DateTimeFormat("ja-JP").format(
    new Date(task.created_at)
  );

  const update = async (fd: FormData) => {
    "use server";
    const title = fd.get("title");
    const description = fd.get("description");
    const completed = fd.get("completed") === "on";

    if (typeof title !== "string") {
      return;
    }

    if (typeof description !== "string") {
      return;
    }

    await api.tasks.update(id, { title, description, completed });
    redirect("/");
  };

  const remove = async () => {
    "use server";
    await api.tasks.remove(id);
    redirect("/");
  };

  return (
    <div className="my-4">
      <h1
        className="leading-none text-xl font-bold"
        style={{ viewTransitionName: `task-${task.id}-title` }}
      >
        {task.title}
      </h1>

      <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">{timestamp}</p>

      <form action={update} className="mt-3 space-y-2">
        <Controller id="title" label="タイトル">
          {(props) => (
            <input
              {...props}
              name="title"
              defaultValue={task.title}
              className="w-full p-2"
            />
          )}
        </Controller>

        <Controller id="description" label="説明文">
          {(props) => (
            <TextareaAutosize
              {...props}
              name="description"
              defaultValue={task.description}
              className="w-full p-2"
            />
          )}
        </Controller>

        <div>
          <label className="flex gap-1 items-center">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={task.completed}
              className="sr-only size-4 peer"
            />

            <div
              aria-hidden
              className={clsx(
                "hidden peer-checked:block",
                "cursor-pointer border-2 p-0.5 rounded bg-emerald-400 dark:bg-emerald-600"
              )}
            >
              <CheckIcon className="size-4" />
            </div>

            <div
              aria-hidden
              className={clsx(
                "block peer-checked:hidden",
                "cursor-pointer border-2 p-0.5 rounded"
              )}
            >
              <div className="size-4" />
            </div>

            <div>完了済み</div>
          </label>

        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" form="remover">
            削除
          </Button>

          <Button type="submit" variant="primary">
            保存
          </Button>
        </div>
      </form>

      <form id="remover" action={remove} />
    </div>
  );
}

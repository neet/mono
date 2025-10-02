import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { api } from "@/api";
import { Task } from "@/models/task";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/16/solid";

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

  const timestamp = new Intl.DateTimeFormat("ja-JP").format(new Date(task.created_at));

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

      <p className="text-zinc-600 text-sm mt-1 font-mono">
        {timestamp}
      </p>

      <form action={update} className="mt-3 space-y-2">
        <div className="border-2 border-e-8 border-b-8 rounded">
          <label
            htmlFor="title"
            className="block border-dashed border-b-2 p-2 text-sm font-bold"
          >
            タイトル
          </label>
          <input
            id="title"
            name="title"
            defaultValue={task.title}
            className="w-full p-2"
          />
        </div>

        <div className="border-2 border-e-8 border-b-8 rounded">
          <label
            htmlFor="description"
            className="block border-dashed border-b-2 p-2 text-sm font-bold"
          >
            説明文
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={task.description}
            className="w-full p-2"
          />
        </div>

        <div>
          <label
            style={{ display: "flex", gap: "0.25em", alignItems: "center" }}
          >
            <input
              type="checkbox"
              name="completed"
              defaultChecked={task.completed}
              className="sr-only size-4 peer"
            />

            <div aria-hidden className={
              clsx(
                "hidden peer-checked:block",
                "cursor-pointer border-2 p-0.5 rounded bg-[#20DA91]",
              )
            }>
              <CheckIcon className="size-4" />
            </div>

            <div aria-hidden className={
              clsx(
                "block peer-checked:hidden",
                "cursor-pointer border-2 p-0.5 rounded",
              )
            }>
              <div className="size-4" />
            </div>

            <div>完了済み</div>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            form="remover"
            className="px-3 py-1 border-2 border-e-8 border-b-8 border-black"
          >
            削除
          </button>

          <button
            type="submit"
            className="bg-[#F55FFF] px-3 py-1 border-2 border-e-8 border-b-8 border-black"
          >
            保存
          </button>
        </div>
      </form>

      <form id="remover" action={remove} />
    </div>
  );
}

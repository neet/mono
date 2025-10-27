import { Metadata } from "next";

import { api } from "@/api";
import { TaskList } from "@/components/TaskList";
import { PlusIcon } from "@heroicons/react/16/solid";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "今日",
};

export default async function Home() {
  const tasks = await api.tasks.list();

  const create = async (fd: FormData) => {
    "use server";
    const title = fd.get("title");

    if (typeof title !== "string") {
      return;
    }

    await api.tasks.create({ title });

    revalidatePath("/");
  };

  return (
    <div className="space-y-3">
      <form
        action={create}
        className="border-2 rounded p-2 flex"
      >
        <input
          id="new-task"
          type="text"
          name="title"
          className="block grow placeholder-stone-600 dark:placeholder-stone-400"
          placeholder="新しいタスク"
        />

        <button className="bg-black p-1 text-white rounded dark:bg-white dark:text-black">
          <PlusIcon className="size-4" />
        </button>
      </form>

      <TaskList tasks={tasks} />
    </div>
  );
}

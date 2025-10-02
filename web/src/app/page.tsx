import { Metadata } from "next";

import { api } from "@/api";
import { TaskList } from "@/components/TaskList";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "今日",
};

export default async function Home() {
  const tasks = await api.tasks.list({ completed: false });

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
    <div>
      <form
        action={create}
        className="border-2 border-e-8 border-b-8 rounded p-2 my-4 flex "
      >
        <input
          id="new-task"
          type="text"
          name="title"
          className="block grow"
          placeholder="新しいタスク"
        />

        <button className="bg-black p-1 text-white rounded">
          <PlusIcon className="size-4" />
        </button>
      </form>

      <div className="space-y-3 mt-4">
        <nav className="flex">
          <Link
            href="/"
            className="border-2 border-e-8 border-b-8 bg-[#F55FFF] px-2 py-1 font-bold border-black"
          >
            すべて
          </Link>

          <Link
            href="/?filter=completed"
            className="px-2 py-1 text-black"
          >
            完了
          </Link>

          <Link
            href="/?filter=incomplete"
            className="px-2 py-1 text-black"
          >
            未完了
          </Link>
        </nav>

        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}

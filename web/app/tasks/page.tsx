import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PlusIcon } from "@heroicons/react/16/solid";

import { api } from "@/api";
import { TaskStatus } from "@/models/task";
import { TaskList } from "@/components/TaskList";
import { TabBar } from "@/components/TabBar";

export const metadata: Metadata = {
  title: "今日",
};

export type TaskProps = {
  searchParams: Promise<{
    status?: TaskStatus | TaskStatus[];
  }>;
};

export default async function TaskPage(props: TaskProps) {
  const { searchParams } = props;
  const { status } = await searchParams;

  const tasks = await api.tasks.list({ status });

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

      <TabBar pending={status === "pending"} className="w-1/2 md:w-1/3" />

      <TaskList tasks={tasks} />
    </div>
  );
}

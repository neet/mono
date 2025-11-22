import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { PlusIcon } from "@heroicons/react/16/solid";

import { api } from "@/api";
import { TaskStatus } from "@/models/task";
import { TaskList } from "@/components/TaskList";
import { TabBar } from "@/components/TabBar";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: PageProps<"/[locale]/tasks">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.tasks", locale });

  return {
    title: t("today")
  }
}

// TODO: Use zod for enum checking
const validateStatus = (x: unknown): x is TaskStatus | TaskStatus[] => {
  if (typeof x === "string") {
    return true;
  }
  if (Array.isArray(x) && x.every(item => typeof item === "string")) {
    return true;
  }
  return false;
}

export default async function TaskPage(props: PageProps<"/[locale]/tasks">) {
  const { searchParams } = props;
  const { status } = await searchParams;
  const t = await getTranslations("pages.tasks");

  if (!validateStatus(status)) {
    return notFound();
  }

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
          placeholder={t("new_task")}
        />

        <button className="bg-black p-1 text-white rounded dark:bg-white dark:text-black">
          <PlusIcon className="size-4" aria-label={t("add")} />
        </button>
      </form>

      <TabBar pending={status === "pending"} className="w-1/2 md:w-1/3" />

      <TaskList tasks={tasks} />
    </div>
  );
}

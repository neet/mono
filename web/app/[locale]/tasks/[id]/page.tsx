import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { api } from "@/api";
import { Task } from "@/models/task";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { TextareaAutosize } from "@/components/TextareaAutosize"

export const generateMetadata = async (props: PageProps<"/[locale]/tasks/[id]">): Promise<Metadata> => {
  const { id } = await props.params;
  const task: Task = await api.tasks.get(id);

  return {
    title: task.title,
  };
};

export default async function TasksIdPage(props: PageProps<"/[locale]/tasks/[id]">) {
  const { id, locale } = await props.params;
  const t = await getTranslations("pages.task_id");
  const task: Task = await api.tasks.get(id);

  const timestamp = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
    .format(new Date(task.created_at));

  const update = async (fd: FormData) => {
    "use server";
    const title = fd.get("title");
    const description = fd.get("description");
    const status = fd.get("status");

    if (typeof title !== "string") {
      return;
    }
    if (typeof description !== "string") {
      return;
    }
    if (typeof status !== "string") {
      return;
    }

    await api.tasks.update(id, { title, description, status });
    revalidatePath(`/${locale}/tasks/${id}`);
  };

  const remove = async () => {
    "use server";
    await api.tasks.remove(id);
    redirect({ href: "/", locale });
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

      <form action={update} className="mt-3 space-y-4">
        <Controller id="status" label={t("status")}>
          {(props) => (
            <select
              {...props}
              name="status"
              defaultValue={task.status}
              className="block px-2 py-1 border-2 rounded"
            >
              <option value="pending">{t("pending")}</option>
              <option value="completed">{t("completed")}</option>
              <option value="canceled">{t("canceled")}</option>
            </select>
          )}
        </Controller>

        <Controller id="title" label={t("title")}>
          {(props) => (
            <input
              {...props}
              name="title"
              defaultValue={task.title}
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

        <Controller id="description" label={t("description")}>
          {(props) => (
            <TextareaAutosize
              {...props}
              name="description"
              defaultValue={task.description}
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

        <div className="flex justify-end gap-2">
          <Button type="submit" form="remover">
            {t("remove")}
          </Button>

          <Button type="submit" variant="primary">
            {t("save")}
          </Button>
        </div>
      </form>

      <form id="remover" action={remove} />
    </div>
  );
}

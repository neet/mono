import type { Metadata } from "next";
import { revalidatePath } from "next/cache";

import { getPathname, redirect } from "@/i18n/navigation";
import { api, ApiError } from "@/api";
import { Task } from "@/models/task";
import { createActionState } from "@/utils/action_state";

import { formSchema, FormState } from "./models";
import { TaskForm } from "./TaskForm";

export const generateMetadata = async (props: PageProps<"/[locale]/tasks/[id]">): Promise<Metadata> => {
  const { id } = await props.params;
  const task: Task = await api.tasks.get(id);

  return {
    title: task.title,
  };
};

export default async function TasksIdPage(props: PageProps<"/[locale]/tasks/[id]">) {
  const { id, locale } = await props.params;
  const task: Task = await api.tasks.get(id);

  const timestamp = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
    .format(new Date(task.created_at));

  const update = async (_: FormState, fd: FormData): Promise<FormState> => {
    "use server";
    const values = formSchema.parse(Object.fromEntries(fd.entries()));

    try {
      await api.tasks.update(id, values);
      revalidatePath(getPathname({ href: `/tasks/${id}`, locale }));
      return { type: "success", values };
    } catch (error) {
      if (error instanceof ApiError) {
        return createActionState(values, error);
      }
      throw error;
    }
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

      <TaskForm task={task} updateAction={update} removeAction={remove} />
    </div>
  );
}

import { Metadata } from "next";
import { revalidatePath } from "next/cache";

import { getPathname, redirect } from "@/i18n/navigation";
import { api, ApiError } from "@/api";
import { createActionState } from "@/utils/action_state";

import { HabitForm } from "./HabitForm";
import { formSchema, FormState } from "./models";

export const generateMetadata = async (props: PageProps<"/[locale]/habits/[id]">): Promise<Metadata> => {
  const { id } = await props.params;
  const habit = await api.habits.get(id);

  return {
    title: habit.title,
  };
};

export default async function HabitPage(props: PageProps<"/[locale]/habits/[id]">) {
  const { locale, id } = await props.params;
  const habit = await api.habits.get(id);

  const update = async (_: FormState, fd: FormData): Promise<FormState> => {
    "use server";
    const values = formSchema.parse(Object.fromEntries(fd.entries()));
    
    try {
      await api.habits.update(id, values);
      revalidatePath(getPathname({ href: `/habits`, locale }));
      revalidatePath(getPathname({ href: `/habits/${id}`, locale }));
      return createActionState(values);
    } catch (error) {
      if (error instanceof ApiError) {
        return createActionState(values, error);
      }
      throw error;
    }
  };

  const remove = async () => {
    "use server";
    await api.habits.remove(id);
    redirect({ href: "/habits", locale });
  };

  return (
    <div className="space-y-3">
      <h2
        className="font-bold text-xl"
        style={{ viewTransitionName: `habit-${habit.id}-title` }}
      >
        {habit.title}
      </h2>

      <HabitForm habit={habit} updateAction={update} removeAction={remove} />
    </div>
  );
}

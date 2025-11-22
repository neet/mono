import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { api } from "@/api";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { Habit } from "@/models/habit";
import { TextareaAutosize } from "@/components/TextareaAutosize"

export const generateMetadata = async (props: PageProps<"/[locale]/habits/[id]">): Promise<Metadata> => {
  const { id } = await props.params;
  const habit: Habit = await api.habits.get(id);

  return {
    title: habit.title,
  };
};

export default async function HabitPage(props: PageProps<"/[locale]/habits/[id]">) {
  const { locale, id } = await props.params;
  const habit = await api.habits.get(id);
  const t = await getTranslations("pages.habits_id");

  const update = async (fd: FormData) => {
    "use server";
    const title = fd.get("title");
    const description = fd.get("description");
    const rrule = fd.get("rrule");
    const tzid = fd.get("tzid");

    if (typeof title !== "string") {
      return;
    }
    if (typeof description !== "string") {
      return;
    }
    if (typeof rrule !== "string") {
      return;
    }
    if (typeof tzid !== "string") {
      return;
    }

    await api.habits.update(id, { title, description, rrule, tzid });
    revalidatePath(`/${locale}/habits/${id}`);
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

      <form className="mt-3 space-y-2" action={update}>
        <div className="space-y-1 rounded">
          <Controller label={t("title")} id="title">
            {(props) => (
              <input
                {...props}
                type="text"
                name="title"
                defaultValue={habit.title}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller label={t("description")} id="description">
            {(props) => (
              <TextareaAutosize
                {...props}
                name="description"
                defaultValue={habit.description}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller label={t("rrule")} id="rrule">
            {(props) => (
              <input
                {...props}
                type="text"
                name="rrule"
                required
                autoCorrect="false"
                spellCheck="false"
                defaultValue={habit.rrule}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller label={t("tzid")} id="tzid">
            {(props) => (
              <input
                {...props}
                type="text"
                name="tzid"
                required
                defaultValue={habit.tzid}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>
        </div>

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

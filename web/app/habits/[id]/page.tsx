import { Metadata } from "next";
import { redirect } from "next/navigation";

import { api } from "@/api";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { Habit } from "@/models/habit";
import { TextareaAutosize } from "@/components/TextareaAutosize"
import { revalidatePath } from "next/cache";

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { id } = await props.params;
  const habit: Habit = await api.habits.get(id);

  return {
    title: habit.title,
  };
};

export default async function HabitPage(props: Props) {
  const { id } = await props.params;
  const habit = await api.habits.get(id);

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
    revalidatePath(`/habits/${id}`);
  };

  const remove = async () => {
    "use server";
    await api.habits.remove(id);
    redirect("/habits");
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
          <Controller label="タイトル" id="title">
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

          <Controller label="説明" id="description">
            {(props) => (
              <TextareaAutosize
                {...props}
                name="description"
                defaultValue={habit.description}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller label="RRULE" id="rrule">
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

          <Controller label="タイムゾーン" id="tzid">
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

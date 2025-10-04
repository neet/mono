import { api } from "@/api";
import { redirect } from "next/navigation";

type HabitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function HabitPage(props: HabitPageProps) {
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
    redirect("/habits");
  };

  const remove = async () => {
    "use server";
    await api.habits.remove(id);
    redirect("/habits");
  };


  return (
    <div className="space-y-3">
      <h2 className="font-bold text-xl">{habit.title}</h2>

      <form className="space-y-2" action={update}>
        <div className="space-y-1 border-2 p-2 rounded">
          <div>
            <label className="block font-bold">タイトル</label>
            <input type="text" name="title" defaultValue={habit.title} />
          </div>

          <div>
            <label className="block font-bold">説明</label>
            <textarea name="description" defaultValue={habit.description} className="w-full" />
          </div>

          <div>
            <label className="block font-bold">RRULE</label>
            <input type="text" name="rrule" className="font-mono w-full" defaultValue={habit.rrule} />
          </div>

          <div>
            <label className="block font-bold">タイムゾーン</label>
            <input type="text" name="tzid" defaultValue={habit.tzid} />
          </div>
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
            className="bg-emerald-500 px-3 py-1 border-2 border-e-8 border-b-8 border-black"
          >
            保存
          </button>
        </div>
      </form>

      <form id="remover" action={remove} />
    </div>
  );
}

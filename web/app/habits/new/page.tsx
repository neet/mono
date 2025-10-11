import { Metadata } from "next";
import { redirect } from "next/navigation";

import { api } from "@/api";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { TextareaAutosize } from "@/components/TextareaAutosize"

export const metadata: Metadata = {
  title: "新規作成",
};

export default async function New() {
  const create = async (fd: FormData) => {
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

    await api.habits.create({ title, description, rrule, tzid });
    redirect("/habits");
  };

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-xl">新規作成</h2>

      <form className="mt-3 space-y-2" action={create}>
        <div className="space-y-1 rounded">
          <Controller label="タイトル" id="title">
            {(props) => (
              <input
                {...props}
                type="text"
                name="title"
              />
            )}
          </Controller>

          <Controller label="説明" id="description">
            {(props) => (
              <TextareaAutosize
                {...props}
                name="description"
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
              />
            )}
          </Controller>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" variant="primary">
            保存
          </Button>
        </div>
      </form>
    </div>
  );
}

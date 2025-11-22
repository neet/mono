import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { api } from "@/api";
import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { TextareaAutosize } from "@/components/TextareaAutosize"

export async function generateMetadata(props: PageProps<"/[locale]/habits/new">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.habits_new", locale });

  return {
    title: t("new"),
  };
}

export default async function New(props: PageProps<"/[locale]/habits/new">) {
  const t = await getTranslations("pages.habits_new");
  const { locale } = await props.params;

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
    redirect({ href: "/habits", locale });
  };

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-xl">{t("new")}</h2>

      <form className="mt-3 space-y-2" action={create}>
        <div className="space-y-1 rounded">
          <Controller label={t("title")} id="title">
            {(props) => (
              <input
                {...props}
                type="text"
                name="title"
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller label={t("description")} id="description">
            {(props) => (
              <TextareaAutosize
                {...props}
                name="description"
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
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" variant="primary">
            {t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}

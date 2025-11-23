import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { api, ApiError } from "@/api";
import { redirect } from "@/i18n/navigation";
import { createActionState } from "@/utils/action_state";

import { formSchema, FormState } from "./models";
import { HabitForm } from "./HabitForm";

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

  const create = async (_: FormState, formData: FormData): Promise<FormState> => {
    "use server";
    const values = formSchema.parse(Object.fromEntries(formData.entries()));
    try {
      await api.habits.create(values);
      redirect({ href: "/habits", locale });
      return createActionState(values);
    } catch (error) {
      console.log({ values, error });
      if (error instanceof ApiError) {
        return createActionState(values, error);
      }
      throw error;
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-xl">{t("new")}</h2>
      <HabitForm action={create} />
    </div>
  );
}

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { api } from "@/api";
import * as RRule from "@/utils/rrule";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(
  props: PageProps<"/[locale]/habits">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.habits", locale });

  return {
    title: t("habits"),
  };
}

export default async function HabitsPage(_: PageProps<"/[locale]/habits">) {
  const t = await getTranslations("pages.habits");
  const habits = await api.habits.list();

  return (
    <div className="space-y-3">
      <header className="flex justify-between">
        <h2 className="font-bold text-xl">{t("habits")}</h2>

        <Link href="/habits/new" className="underline">
          {t("new")}
        </Link>
      </header>

      <div className="border-2 mt-2 divide-y-2 rounded">
        {habits.map((habit) => (
          <div key={habit.id} className="p-2 flex justify-between">
            <Link
              href={`/habits/${habit.id}`}
              className="hover:underline"
              style={{ viewTransitionName: `habit-${habit.id}-title` }}
            >
              {habit.title}
            </Link>
            <div>{RRule.toLocaleString(RRule.parse(habit.rrule))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

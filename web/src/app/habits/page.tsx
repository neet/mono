import { api } from "@/api";
import * as RRule from "@/utils/rrule";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "習慣",
};

export default async function HabitsPage() {
  const habits = await api.habits.list();

  return (
    <div className="space-y-3">
      <header className="flex justify-between">
        <h2 className="font-bold text-xl">習慣</h2>

        <Link href="/habits/new" className="underline">
          新規作成
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

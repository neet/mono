"use client";

import { FC, useActionState } from "react";
import { useTranslations } from "next-intl";

import { Controller } from "@/components/Controller";
import { Button } from "@/components/Button";
import { TextareaAutosize } from "@/components/TextareaAutosize";
import { Habit } from "@/models/habit";
import { mapFailure } from "@/utils/action_state";
import { Notification } from "@/components/Notification";

import { FormState } from "./models";

export type HabitFormProps = {
  habit: Habit;
  updateAction: (prevState: FormState, fd: FormData) => Promise<FormState>;
  removeAction: (fd: FormData) => Promise<void>;
};

export const HabitForm: FC<HabitFormProps> = (props) => {
  const { habit, removeAction } = props;

  const t = useTranslations("pages.habits_id");
  const [state, updateAction] = useActionState(props.updateAction, {
    type: "pending",
    values: {
      title: habit.title,
      description: habit.description,
      rrule: habit.rrule,
      tzid: habit.tzid,
    },
  });

  return (
    <div className="mt-3 space-y-5">
      {state.type === "success" && <Notification>{t("success")}</Notification>}

      <form className="mt-3 space-y-2" action={updateAction}>
        <div className="space-y-1 rounded">
          <Controller
            label={t("title")}
            id="title"
            errors={mapFailure(state, (s) => s.errors.title)}
          >
            {(props) => (
              <input
                {...props}
                type="text"
                name="title"
                defaultValue={state.values.title}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller
            label={t("description")}
            id="description"
            errors={mapFailure(state, (s) => s.errors.description)}
          >
            {(props) => (
              <TextareaAutosize
                {...props}
                name="description"
                defaultValue={state.values.description}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller
            label={t("rrule")}
            id="rrule"
            errors={mapFailure(state, (s) => s.errors.rrule)}
          >
            {(props) => (
              <input
                {...props}
                type="text"
                name="rrule"
                required
                autoCorrect="false"
                spellCheck="false"
                defaultValue={state.values.rrule}
                className="w-full p-2 border-2 rounded"
              />
            )}
          </Controller>

          <Controller
            label={t("tzid")}
            id="tzid"
            errors={mapFailure(state, (s) => s.errors.tzid)}
          >
            {(props) => (
              <input
                {...props}
                type="text"
                name="tzid"
                required
                defaultValue={state.values.tzid}
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

      <form id="remover" action={removeAction} />
    </div>
  );
};

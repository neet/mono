"use client";

import { useTranslations } from "next-intl";
import { FC, useActionState } from "react";

import { Controller } from "@/components/Controller";
import { TextareaAutosize } from "@/components/TextareaAutosize";
import { Button } from "@/components/Button";
import { FormState } from "./models";

export type HabitFormProps = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export const HabitForm: FC<HabitFormProps> = (props) => {
  const { action } = props;

  const t = useTranslations("pages.habits_new");
  const [state, formAction] = useActionState(action, {
    values: {},
    errors: {},
  });

  return (
    <form className="mt-3 space-y-2" action={formAction}>
      <div className="space-y-1 rounded">
        <Controller label={t("title")} id="title" errors={state.errors.title}>
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

        <Controller label={t("description")} id="description" errors={state.errors.description}>
          {(props) => (
            <TextareaAutosize
              {...props}
              name="description"
              defaultValue={state.values.description}
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

        <Controller label={t("rrule")} id="rrule" errors={state.errors.rrule}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="rrule"
              defaultValue={state.values.rrule}
              required
              autoCorrect="false"
              spellCheck="false"
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

        <Controller label={t("tzid")} id="tzid" errors={state.errors.tzid}>
          {(props) => (
            <input
              {...props}
              type="text"
              name="tzid"
              defaultValue={state.values.tzid}
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
  );
};

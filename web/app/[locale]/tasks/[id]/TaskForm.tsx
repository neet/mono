"use client";

import { useTranslations } from "next-intl";
import { FC, useActionState } from "react";

import { Task } from "@/models/task";
import { Controller } from "@/components/Controller";
import { Button } from "@/components/Button";
import { TextareaAutosize } from "@/components/TextareaAutosize";

import { FormState } from "./models";
import { mapFailure } from "@/utils/action_state";
import { Notification } from "@/components/Notification";

export type TaskFormProps = {
  task: Task;
  updateAction: (formState: FormState, fd: FormData) => Promise<FormState>;
  removeAction: () => Promise<void>;
};

export const TaskForm: FC<TaskFormProps> = (props) => {
  const { task, removeAction } = props;

  const t = useTranslations("pages.task_id");
  const [state, updateAction] = useActionState(props.updateAction, {
    type: "pending",
    values: {
      status: task.status,
      title: task.title,
      description: task.description,
      deadline_on: task.deadline_on,
    },
  });

  return (
    <div className="mt-3 space-y-5">
      {state.type === "success" && <Notification>{t("success")}</Notification>}

      <form action={updateAction} className="space-y-4" key={task.updated_at}>
        <Controller
          id="status"
          label={t("status")}
          errors={mapFailure(state, (s) => s.errors.status)}
        >
          {(props) => (
            <select
              {...props}
              name="status"
              defaultValue={state.values.status}
              className="block px-2 py-1 border-2 rounded"
            >
              <option value="pending">{t("pending")}</option>
              <option value="completed">{t("completed")}</option>
              <option value="canceled">{t("canceled")}</option>
            </select>
          )}
        </Controller>

        <Controller
          id="title"
          label={t("title")}
          errors={mapFailure(state, (s) => s.errors.title)}
        >
          {(props) => (
            <input
              {...props}
              name="title"
              defaultValue={state.values.title}
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

        <Controller
          id="description"
          label={t("description")}
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
          id="deadline_on"
          label={t("deadline_on")}
          errors={mapFailure(state, (s) => s.errors.deadline_on)}
        >
          {(props) => (
            <input
              {...props}
              type="date"
              name="deadline_on"
              defaultValue={state.values.deadline_on ?? undefined}
              className="w-full p-2 border-2 rounded"
            />
          )}
        </Controller>

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

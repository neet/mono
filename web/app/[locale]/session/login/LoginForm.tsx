"use client";

import { FC, useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";
import { mapFailure } from "@/utils/action_state";

import { FormState } from "./models";

export type LoginFormProps = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export const LoginForm: FC<LoginFormProps> = (props) => {
  const { action } = props;

  const error = useRef<HTMLAnchorElement>(null);
  const t = useTranslations("pages.session_login");
  const [actionState, formAction] = useActionState(action, {
    type: "pending",
    values: {},
  });

  useEffect(() => {
    error.current?.focus();
  }, [actionState]);

  return (
    <form action={formAction} className="my-4 space-y-3">
      <a href="#" ref={error} tabIndex={-1} className="block">
        {mapFailure(
          actionState,
          (s) =>
            s.error && (
              <p className="rounded py-2 px-3 dark:bg-red-950 dark:text-red-400">
                {s.error}
              </p>
            ),
        )}
      </a>

      <Controller
        id="email"
        label={t("email")}
        errors={mapFailure(actionState, (s) => s.errors.email)}
      >
        {(props) => (
          <input
            {...props}
            name="email"
            type="email"
            required
            defaultValue={actionState.values.email}
            className="w-full p-2 border-2 rounded"
            autoComplete="email"
          />
        )}
      </Controller>

      <Controller
        id="password"
        label={t("password")}
        errors={mapFailure(actionState, (s) => s.errors.password)}
      >
        {(props) => (
          <input
            {...props}
            name="password"
            type="password"
            required
            defaultValue={actionState.values.password}
            className="w-full p-2 border-2 rounded"
            autoComplete="current-password"
          />
        )}
      </Controller>

      <Button type="submit">{t("login")}</Button>
    </form>
  );
};

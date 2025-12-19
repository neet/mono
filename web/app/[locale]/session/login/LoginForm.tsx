"use client";

import { FC } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/Button";
import { Controller } from "@/components/Controller";

export const LoginForm: FC = () => {
  const locale = useLocale();
  const t = useTranslations("pages.session_login");

  return (
    <form
      method="POST"
      action={`/${locale}/session/login/api`}
      className="my-4 space-y-3"
    >
      <Controller id="email" label={t("email")}>
        {(props) => (
          <input
            {...props}
            name="email_address"
            type="email"
            required
            className="w-full p-2 border-2 rounded"
            autoComplete="email"
          />
        )}
      </Controller>

      <Controller id="password" label={t("password")}>
        {(props) => (
          <input
            {...props}
            name="password"
            type="password"
            required
            className="w-full p-2 border-2 rounded"
            autoComplete="current-password"
          />
        )}
      </Controller>

      <Button type="submit">{t("login")}</Button>
    </form>
  );
};

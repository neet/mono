import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "./LoginForm";

export async function generateMetadata(
  props: PageProps<"/[locale]/habits/new">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.session_login", locale });

  return {
    title: t("login"),
  };
}

export default async function LoginPage(
  _props: PageProps<"/[locale]/session/login">,
) {
  return <LoginForm />;
}

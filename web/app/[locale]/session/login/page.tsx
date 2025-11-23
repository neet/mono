import { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import setCookieParser from "set-cookie-parser";

import { redirect } from "@/i18n/navigation";
import { ApiError } from "@/api";
import { createActionState } from "@/utils/action_state";

import { LoginForm } from "./LoginForm";
import { formSchema, FormState } from "./models";

export async function generateMetadata(props: PageProps<"/[locale]/habits/new">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.session_login", locale });

  return {
    title: t("login"),
  };
}

export default async function LoginPage(props: PageProps<"/[locale]/session/login">) {
  const { locale } = await props.params;

  const action = async (_: FormState, fd: FormData): Promise<FormState> => {
    "use server";
    const values = formSchema.parse(Object.fromEntries(fd.entries()));

    try {
      const res = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw await res.json();
      }

      const requestCookies = await cookies();
      const entries = res.headers.getSetCookie();
      for (const entry of entries) {
        const { name, value, ...rest } = setCookieParser.parseString(entry);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestCookies.set(name, value, rest as any);
      }

      redirect({ href: "/", locale });
      return createActionState(values);
    } catch (error) {
      if (error instanceof ApiError) {
        return createActionState(values, error);
      }
      throw error;
    }
  };

  return <LoginForm action={action} />;
}

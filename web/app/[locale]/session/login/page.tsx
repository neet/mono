import { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import setCookieParser from "set-cookie-parser";

import { redirect } from "@/i18n/navigation";

export async function generateMetadata(props: PageProps<"/[locale]/habits/new">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ namespace: "pages.login", locale });

  return {
    title: t("login"),
  };
}

export default async function LoginPage(props: PageProps<"/[locale]/session/login">) {
  const { locale } = await props.params;
  const t = await getTranslations();

  const action = async (fd: FormData): Promise<void> => {
    "use server";
    const email = fd.get("email");
    const password = fd.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error(`Unexpected parameters ${email}, ${password}`);
    }

    const res = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const cookie = await cookies();
    const entries = res.headers.getSetCookie();
    for (const entry of entries) {
      const { name, value, ...rest } = setCookieParser.parseString(entry);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cookie.set(name, value, rest as any);
    }

    redirect({ href: "/", locale });
  };

  return (
    <div>
      <form action={action} className="my-4 space-y-3">
        <div className="border-2 border-e-8 border-b-8 rounded">
          <label
            htmlFor="email"
            className="block border-dashed border-b-2 p-2 text-sm font-bold"
          >
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full p-2 border-2 rounded"
            autoComplete="email"
          />
        </div>

        <div className="border-2 border-e-8 border-b-8 rounded">
          <label
            htmlFor="password"
            className="block border-dashed border-b-2 p-2 text-sm font-bold"
          >
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full p-2 border-2 rounded"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="bg-[#F55FFF] px-3 py-1 border-2 border-e-8 border-b-8 border-black"
        >
          {t("login")}
        </button>
      </form>
    </div>
  );
}

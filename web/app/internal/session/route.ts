import setCookieParser from "set-cookie-parser";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const formSchema = z.object({
  email_address: z.string(),
  password: z.string(),
});

export async function POST(
  req: NextRequest,
  _ctx: RouteContext<"/internal/session">,
) {
  const fd = await req.formData();
  const values = formSchema.parse(Object.fromEntries(fd.entries()));

  try {
    const session = await fetch("http://localhost:3000/api/web/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": await getLocale(),
      },
      body: JSON.stringify(values),
    });

    if (!session.ok) {
      return session;
    }

    // https://github.com/better-auth/better-auth/issues/6535
    const process = await auth.api.signInWithOAuth2({
      body: {
        providerId: "mono",
        callbackURL: "/",
      },
      headers: await headers(),
      asResponse: true,
    });

    if (!process.ok) {
      throw process;
    }

    const { url } = (await process.json()) as Awaited<
      ReturnType<typeof auth.api.signInWithOAuth2>
    >;

    const res = NextResponse.redirect(url);

    const setCookies = [
      ...session.headers.getSetCookie(),
      ...process.headers.getSetCookie(),
    ];

    for (const setCookie of setCookies) {
      const { name, value, ...rest } = setCookieParser.parseString(setCookie);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.cookies.set(name, value, rest as any);
    }

    return res;
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

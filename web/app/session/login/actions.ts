"use server";

import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export type LoginActionState = {
  success: boolean;
  error?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  try {
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

    if (!res.ok) {
      return {
        success: false,
        error: "Login failed",
      };
    }

    const cookie = await cookies();
    const entries = res.headers.getSetCookie();
    for (const entry of entries) {
      const { name, value, ...rest } = setCookieParser.parseString(entry);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cookie.set(name, value, rest as any);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

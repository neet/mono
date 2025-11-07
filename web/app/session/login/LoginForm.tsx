"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, LoginActionState } from "./actions";

const initialState: LoginActionState = {
  success: false,
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="my-4 space-y-3">
      <div className="border-2 border-e-8 border-b-8 rounded">
        <label
          htmlFor="email"
          className="block border-dashed border-b-2 p-2 text-sm font-bold"
        >
          メールアドレス
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
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-2 border-2 rounded"
          autoComplete="current-password"
        />
      </div>

      {state.error && (
        <div className="text-red-600 text-sm">{state.error}</div>
      )}

      <button
        type="submit"
        className="bg-[#F55FFF] px-3 py-1 border-2 border-e-8 border-b-8 border-black"
      >
        ログイン
      </button>
    </form>
  );
}

import { ApiError } from "@/api";

export type ActionState<T> = {
  values: Partial<T>;
  error?: string;
  errors: { [key in keyof T]?: string[] };
}

export const createActionState = <T>(values: Partial<T>, apiError?: ApiError<keyof T>): ActionState<T> => {
  return {
    values,
    error: apiError?.error,
    errors: apiError?.errors ?? {},
  }
}

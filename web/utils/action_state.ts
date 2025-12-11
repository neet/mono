import { ApiError } from "@/api";

export type BaseActionState<T> = {
  values: Partial<T>;
};

export type PendingActionState<T> = BaseActionState<T> & {
  type: "pending",
};

export type SuccessActionState<T> = BaseActionState<T> & {
  type: "success",
};

export type FailureActionState<T> = BaseActionState<T> & {
  type: "failure",
  error?: string;
  errors: { [key in keyof T]?: string[] };
};

export type ActionState<T> =
  | PendingActionState<T>
  | SuccessActionState<T>
  | FailureActionState<T>;

/** @deprecated */
export const createActionState = <T>(values: Partial<T>, apiError?: ApiError<keyof T>): ActionState<T> => {
  return {
    type: "failure",
    values,
    error: apiError?.error,
    errors: apiError?.errors ?? {},
  }
}

export const mapFailure = <T, U>(
  state: ActionState<T>,
  map: (state: FailureActionState<T>) => U
): U | undefined => {
  if (state.type === "failure") {
    return map(state);
  } 
}


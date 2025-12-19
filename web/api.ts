import { APIError } from "better-auth";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { Task, TaskStatus } from "./models/task";
import { Habit } from "./models/habit";
import { redirect } from "./i18n/navigation";
import { auth } from "./lib/auth";

export class ApiError<T extends string | number | symbol> {
  error?: string;
  errors: { [key in T]?: string[] } = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any) {
    if ("error" in data) {
      this.error = data.error;
    } else {
      this.errors = data;
    }
  }
}

const getAccessToken = async (): Promise<string> => {
  const locale = await getLocale();

  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "mono",
      },
      headers: await headers(),
    });

    return accessToken;
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 401) {
      throw redirect({ href: "/session/login", locale });
    } else {
      throw error;
    }
  }
};

const request = async <T>(
  method: string,
  path: string,
  search?: Record<string, unknown>,
  body?: Record<string, unknown>,
): Promise<T> => {
  const locale = await getLocale();
  const accessToken = await getAccessToken();

  let url = new URL(path, "http://localhost:3000").toString();

  if (search) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      searchParams.append(key, String(value));
    }
    url += "?" + searchParams.toString();
  }

  const init: RequestInit = {
    method,
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": locale,
    }),
  };

  if (body) {
    init.body = JSON.stringify(body);
    (init.headers as Headers).append("Content-Type", "application/json");
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    if (res.status === 401) {
      throw redirect({ href: "/session/login", locale });
    }
    if (res.status === 404) {
      throw notFound();
    }
    if (res.status === 422) {
      const data = await res.json();
      throw new ApiError(data);
    }
    throw new Error(`Unexpected error from the server: ${res.statusText}`, {
      cause: res,
    });
  }

  const contentType = res.headers.get("Content-Type");
  if (!contentType || !contentType.startsWith("application/json")) {
    return undefined as T;
  }

  return await res.json();
};
const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && x.constructor.name === "Object";

const flatten = (object: unknown, parent = ""): [string, unknown][] => {
  if (Array.isArray(object)) {
    return object.flatMap((value, i) =>
      flatten(value, parent === "" ? i.toString() : `${parent}[]`),
    );
  }

  if (isRecord(object)) {
    return Object.entries(object).flatMap(([key, value]) =>
      flatten(value, parent === "" ? key : `${parent}[${key}]`),
    );
  }

  return [[parent, object]];
};

const stringifyUrl = (object: unknown) => {
  return flatten(object)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
};

const http = {
  get: <T>(
    path: string,
    searchParams?: Record<string, unknown>,
  ): Promise<T> => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      return request<T>("GET", `${path}?${stringifyUrl(searchParams)}`);
    } else {
      return request<T>("GET", path);
    }
  },

  post: <T>(path: string, body?: Record<string, unknown>): Promise<T> => {
    return request<T>("POST", path, undefined, body);
  },

  put: <T>(path: string, body?: Record<string, unknown>): Promise<T> => {
    return request<T>("PUT", path, undefined, body);
  },

  delete: <T>(path: string, body?: Record<string, unknown>): Promise<T> => {
    return request<T>("DELETE", path, undefined, body);
  },
};

// -----------------------------------------------------------------------------

type ListTasksParams = {
  readonly status?: TaskStatus | readonly TaskStatus[];
};

const listTasks = (params: ListTasksParams = {}): Promise<Task[]> => {
  return http.get<Task[]>("/api/v1/tasks", params);
};

const getTask = (id: string): Promise<Task> => {
  return http.get<Task>(`/api/v1/tasks/${id}`);
};

type CreateTaskParams = {
  readonly title?: string;
  readonly description?: string;
};

const createTask = (params: CreateTaskParams): Promise<Task> => {
  return http.post(`/api/v1/tasks`, params);
};

type UpdateTaskParams = {
  readonly title?: string;
  readonly description?: string;
  readonly status?: string;
  readonly deadline_on?: string | null;
};

const updateTask = (id: string, params: UpdateTaskParams): Promise<Task> => {
  return http.put(`/api/v1/tasks/${id}`, params);
};

const removeTask = (id: string): Promise<void> => {
  return http.delete(`/api/v1/tasks/${id}`);
};

const listHabits = (): Promise<Habit[]> => {
  return http.get<Habit[]>("/api/v1/habits");
};

const getHabit = (id: string): Promise<Habit> => {
  return http.get<Habit>(`/api/v1/habits/${id}`);
};

type CreateHabitParams = {
  readonly rrule: string;
  readonly tzid: string;
  readonly title?: string;
  readonly description?: string;
};

const createHabit = (params: CreateHabitParams): Promise<Habit> => {
  return http.post(`/api/v1/habits`, params);
};

type UpdateHabitParams = {
  readonly rrule?: string;
  readonly tzid?: string;
  readonly title?: string;
  readonly description?: string;
};

const updateHabit = (id: string, params: UpdateHabitParams): Promise<Task> => {
  return http.put(`/api/v1/habits/${id}`, params);
};

const removeHabit = (id: string): Promise<void> => {
  return http.delete(`/api/v1/habits/${id}`);
};

export const api = {
  tasks: {
    get: getTask,
    list: listTasks,
    create: createTask,
    remove: removeTask,
    update: updateTask,
  },
  habits: {
    get: getHabit,
    list: listHabits,
    create: createHabit,
    remove: removeHabit,
    update: updateHabit,
  },
};

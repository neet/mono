import { cookies } from "next/headers";
import { Task, TaskStatus } from "./models/task";
import { Habit } from "./models/habit";
import { notFound, redirect } from "next/navigation";

const request = async <T>(
  method: string,
  path: string,
  search?: Record<string, unknown>,
  body?: Record<string, unknown>
): Promise<T> => {
  const ck = await cookies();

  let url = new URL(path, "http://localhost:3000").toString();

  if (search) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      searchParams.append(key, String(value));
    }
    url += "?" + searchParams.toString();
  }

  const headers = new Headers({
    Cookie: ck.toString(),
  });

  if (body) {
    headers.append("Content-Type", "application/json");
  }

  const init: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    if (res.status === 401) {
      return redirect("/session/login");
    }
    if (res.status === 404) {
      return notFound();
    }
    throw new Error(`Unexpected error from the server: ${res.statusText}`, {
      cause: res,
    });
  }

  if (!res.headers.get("Content-Type")?.startsWith("application/json")) {
    return undefined as T;
  }

  return await res.json();
};

const http = {
  get: <T>(
    path: string,
    searchParams?: Record<string, unknown>
  ): Promise<T> => {
    return request<T>("GET", path, searchParams);
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
};

const updateTask = (id: string, params: UpdateTaskParams): Promise<Task> => {
  return http.put(`/api/v1/tasks/${id}`, params);
};

const removeTask = (id: string): Promise<void> => {
  return http.delete(`/api/v1/tasks/${id}`);
};

type CreateSessionParams = {
  readonly email: string;
  readonly password: string;
};

const createSession = async (params: CreateSessionParams) => {
  return http.post("/api/v1/sessions", params);
};

const listHabits = (): Promise<Habit[]> => {
  return http.get<Habit[]>("/api/v1/habits");
}

const getHabit = (id: string): Promise<Habit> => {
  return http.get<Habit>(`/api/v1/habits/${id}`);
}

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
  session: {
    create: createSession,
  },
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
  }
};

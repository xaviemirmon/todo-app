import { Todo } from "types/todo";

const API_URL = import.meta.env.VITE_API_URL;

export const getFn = () => fetch(`${API_URL}/todos`).then((res) => res.json());

export const postFn = (todo: Todo) =>
  fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

export const patchFn = (todo: Todo) =>
  fetch(`${API_URL}/todos`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

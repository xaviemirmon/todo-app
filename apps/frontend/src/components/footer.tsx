import { FormEvent, useState } from "react";
import { SuccessButton } from "./buttons/success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "types/todo";
import { postFn } from "../lib/fetch";

export const Footer = () => {
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const response = await postFn(todo);

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      return response.json();
    },
    onError: (error) => {
      setError(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodo("");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTodoMutation.mutate({
      id: new Date().getTime().toString(),
      title: newTodo.trim(),
      completed: false,
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit} role="form">
      <div className="flex flex-row gap-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-1 text-sm rounded"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <SuccessButton
          disabled={addTodoMutation.isPending || !newTodo.trim()}
        />
      </div>
      <div>{error && <div className="text-red-500">{error}</div>}</div>
    </form>
  );
};

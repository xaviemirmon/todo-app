import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "types/todo";
import { patchFn } from "../lib/fetch";
import { ChangeEvent, useState } from "react";

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const updateTodoMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const response = await patchFn(todo);

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      return response.json();
    },
    onError: (error) => {
      setIsCompleted(!isCompleted);
      console.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleToggle = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Optimistic update
    setIsCompleted(!isCompleted);

    try {
      updateTodoMutation.mutate({
        id: todo.id,
        title: todo.title,
        completed: !todo.completed,
      });
    } catch (error) {
      // Revert to original state if the API call fails
      setIsCompleted(isCompleted);
      console.error("Failed to toggle todo:", error);
    }
  };

  return (
    <div className="py-1">
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={isCompleted}
        className={`mr-1 `}
        aria-label={`Mark "${todo.title}" as ${isCompleted ? "incomplete" : "complete"}`}
      />
      <span
        className={`${isCompleted ? "line-through text-gray-400" : "text-black"}`}
      >
        {todo.title}
      </span>
    </div>
  );
};

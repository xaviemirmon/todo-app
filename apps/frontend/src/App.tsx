import { useQuery } from "@tanstack/react-query";

import { Todo } from "types/todo";
import { TodoItem } from "./components/todo-item";
import { Container } from "./components/container";
import { getFn } from "./lib/fetch";

function App() {
  const { status, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getFn,
  });

  return (
    <Container>
      <div className="overflow-auto flex flex-col">
        {status === "pending" && <div>Loading...</div>}
        {status === "error" && <div>Error: {error.message}</div>}
        {status === "success" && data.length === 0 && <div>No todos found</div>}
        {status === "success" &&
          data.length > 0 &&
          data.map((todo: Todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
    </Container>
  );
}

export default App;

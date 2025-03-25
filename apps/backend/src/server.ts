import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";
import { Todo } from "types/todo";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "todos.json");

if (!fs.existsSync(FILE_PATH)) {
  fs.writeJsonSync(FILE_PATH, { todos: [] });
}

async function readTodos(): Promise<Todo[]> {
  const data = await fs.readJson(FILE_PATH);
  return data.todos || [];
}

function writeTodos(todos: Todo[]): Promise<void> {
  return fs.writeJson(FILE_PATH, { todos }, { spaces: 2 });
}

app.get("/api/todos", function (req, res) {
  readTodos()
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch todos" });
    });
});

app.post("/api/todos", function (req, res) {
  const title = req.body.title;

  if (!title) {
    res.status(400).json({ error: "Text is required" });
    return;
  }

  readTodos()
    .then(async (todos: Todo[]) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title,
        completed: false,
      };

      await writeTodos([newTodo, ...todos]);
      return newTodo;
    })
    .then((newTodo) => {
      res.status(201).json(newTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create todo" });
    });
});

app.patch("/api/todos", function (req, res) {
  const { title, id, completed } = req.body;

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  readTodos()
    .then(async (todos: Todo[]) => {
      const newTodo: Todo = {
        id,
        title,
        completed: completed || false,
      };

      await writeTodos(
        todos.map((item) => {
          if (item.id === id) {
            return { ...item, ...newTodo };
          }
          return item;
        }),
      );
      return newTodo;
    })
    .then((newTodo) => {
      res.status(201).json(newTodo);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create todo" });
    });
});

app.delete("/api/todos/:id", function (req, res) {
  const id = req.params.id;

  readTodos()
    .then((todos) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      return writeTodos(updatedTodos);
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to delete todo" });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

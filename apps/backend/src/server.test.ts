import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import request from "supertest";
import app from "./server";
import fs from "fs-extra";
import path from "path";

const TEST_FILE_PATH = path.join(__dirname, "todos.json");

describe("Todo API", () => {
  // Sample todo for testing
  const sampleTodo = {
    title: "Test Todo",
  };

  let server: any;

  beforeEach(async () => {
    // Reset test data before each test
    await fs.writeJson(TEST_FILE_PATH, { todos: [] });
    // Start the server if it's not already running
    if (!server) {
      const PORT = 3001; // Use different port than your main app
      server = app.listen(PORT);
    }
  });

  afterEach(async () => {
    // Clean up after each test
    await fs.writeJson(TEST_FILE_PATH, { todos: [] });
  });

  afterAll(async () => {
    // Close the server after all tests
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          resolve();
        });
      });
    }
  });

  describe("GET /api/todos", () => {
    it("should return an empty array when no todos exist", async () => {
      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all todos", async () => {
      // Add a todo first
      const createResponse = await request(app)
        .post("/api/todos")
        .send(sampleTodo);

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(sampleTodo.title);
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const response = await request(app).post("/api/todos").send(sampleTodo);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(sampleTodo.title);
      expect(response.body.completed).toBe(false);
      expect(response.body.id).toBeDefined();
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app).post("/api/todos").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Text is required");
    });
  });

  describe("PATCH /api/todos", () => {
    it("should update a todo", async () => {
      // Create a todo first
      const createResponse = await request(app)
        .post("/api/todos")
        .send(sampleTodo);

      const todoId = createResponse.body.id;

      const updateResponse = await request(app).patch("/api/todos").send({
        id: todoId,
        title: "Updated Todo",
        completed: true,
      });

      expect(updateResponse.status).toBe(201);
      expect(updateResponse.body.title).toBe("Updated Todo");
      expect(updateResponse.body.completed).toBe(true);

      // Verify the update with a GET request
      const getResponse = await request(app).get("/api/todos");
      const updatedTodo = getResponse.body.find(
        (todo: any) => todo.id === todoId,
      );

      expect(updatedTodo.title).toBe("Updated Todo");
      expect(updatedTodo.completed).toBe(true);
    });

    it("should return 400 if id is missing", async () => {
      const response = await request(app).patch("/api/todos").send({
        title: "Updated Todo",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing id");
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo", async () => {
      // Create a todo first
      const createResponse = await request(app)
        .post("/api/todos")
        .send(sampleTodo);

      const todoId = createResponse.body.id;

      // Delete the todo
      const deleteResponse = await request(app).delete(`/api/todos/${todoId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Verify the todo was deleted
      const getResponse = await request(app).get("/api/todos");
      const deletedTodo = getResponse.body.find(
        (todo: any) => todo.id === todoId,
      );

      expect(deletedTodo).toBeUndefined();
    });
  });
});

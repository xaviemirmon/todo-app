import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Sample todos for testing
export const mockTodos = [
  { id: "1", title: "Test Todo 1", completed: false },
  { id: "2", title: "Test Todo 2", completed: true },
];

// Setup MSW server to intercept API requests
export const server = setupServer(
  http.get("*/todos", () => {
    return HttpResponse.json(mockTodos);
  }),

  http.post("*/todos", async ({ request }) => {
    const newTodo = await request.json();
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.patch("*/todos", async ({ request }) => {
    const updatedTodo = await request.json();
    return HttpResponse.json(updatedTodo, { status: 200 });
  }),
);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

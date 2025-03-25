import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "./todo-item";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as fetchModule from "../lib/fetch";

// Mock the fetch module
vi.mock("../lib/fetch", () => ({
  patchFn: vi.fn(),
}));

describe("TodoItem", () => {
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Reset mocks before each test
    vi.clearAllMocks();
  });

  const renderComponent = (todo = mockTodo) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TodoItem todo={todo} />
      </QueryClientProvider>,
    );
  };

  it("renders the todo item with correct initial state", () => {
    const { getByText, getByRole } = renderComponent();

    // Check that the todo title is displayed
    expect(getByText("Test Todo")).toBeDefined();

    // Check that the checkbox is unchecked initially
    const checkbox = getByRole("checkbox", {
      name: /Mark "Test Todo" as complete/,
    });
    expect(checkbox).not.toBeChecked();

    // Check that the todo title is not crossed out initially
    const todoText = getByText("Test Todo");
    expect(todoText.className).not.toContain("line-through");
    expect(todoText.className).not.toContain("text-gray-400");
  });

  it("renders a completed todo correctly", () => {
    const completedTodo = { ...mockTodo, completed: true };
    const { getByText, getByRole } = renderComponent(completedTodo);

    // Check that the checkbox is checked
    const checkbox = getByRole("checkbox", {
      name: /Mark "Test Todo" as incomplete/,
    });
    expect(checkbox).toBeChecked();

    // Check that the todo title is crossed out
    const todoText = getByText("Test Todo");
    expect(todoText.className).toContain("line-through");
    expect(todoText.className).toContain("text-gray-400");
  });

  it("toggles the todo when checkbox is clicked (successful update)", async () => {
    // Set up user event
    const user = userEvent.setup();

    // Mock successful API response
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ ...mockTodo, completed: true }),
    };
    vi.mocked(fetchModule.patchFn).mockResolvedValue(
      mockResponse as unknown as Response,
    );

    const { getByText, getByRole } = renderComponent();

    // Find and click the checkbox
    const checkbox = getByRole("checkbox");
    await user.click(checkbox);

    // Check optimistic update was applied
    expect(checkbox).toBeChecked();

    // Check that the todo title is now crossed out (optimistic update)
    const todoText = getByText("Test Todo");
    expect(todoText.className).toContain("line-through");
    expect(todoText.className).toContain("text-gray-400");

    // Verify the API was called with correct parameters
    expect(fetchModule.patchFn).toHaveBeenCalledWith({
      id: "1",
      title: "Test Todo",
      completed: true,
    });
  });
});

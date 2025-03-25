import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Footer } from "./footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as fetchModule from "../lib/fetch";

// Mock the fetch module
vi.mock("../lib/fetch", () => ({
  postFn: vi.fn(),
}));

describe("Footer Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Reset the postFn mock before each test
    vi.mocked(fetchModule.postFn).mockReset();

    // Mock Date.now to return a consistent timestamp for testing
    vi.spyOn(Date.prototype, "getTime").mockReturnValue(1234567890);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Footer />
      </QueryClientProvider>,
    );
  };

  it("renders the form with input and button", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Add new todo")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Add new todo");
    fireEvent.change(input, { target: { value: "New task" } });

    expect(input).toHaveValue("New task");
  });

  it("disables the button when input is empty", () => {
    renderComponent();

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    const input = screen.getByPlaceholderText("Add new todo");
    fireEvent.change(input, { target: { value: "New task" } });

    expect(button).not.toBeDisabled();
  });

  it("submits the form with correct data", async () => {
    // Mock successful response
    vi.mocked(fetchModule.postFn).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: "1234567890",
        title: "New task",
        completed: false,
      }),
    } as unknown as Response);

    // Spy on queryClient.invalidateQueries
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    renderComponent();

    const input = screen.getByPlaceholderText("Add new todo");

    fireEvent.change(input, { target: { value: "New task" } });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(vi.mocked(fetchModule.postFn)).toHaveBeenCalledWith({
        id: "1234567890",
        title: "New task",
        completed: false,
      });
    });

    // Check if queries were invalidated
    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["todos"],
      });
    });

    // Input should be cleared after successful submission
    expect(input).toHaveValue("");
  });

  it("displays error message on submission failure", async () => {
    // Mock failed response
    vi.mocked(fetchModule.postFn).mockResolvedValue({
      ok: false,
    } as Response);

    renderComponent();

    const input = screen.getByPlaceholderText("Add new todo");

    fireEvent.change(input, { target: { value: "New task" } });
    fireEvent.submit(screen.getByRole("form"));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Failed to add todo")).toBeInTheDocument();
    });

    // Input value should remain after failed submission
    expect(input).toHaveValue("New task");
  });

  it("trims whitespace from todo title before submission", async () => {
    // Mock successful response
    vi.mocked(fetchModule.postFn).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: "1234567890",
        title: "New task",
        completed: false,
      }),
    } as unknown as Response);

    renderComponent();

    const input = screen.getByPlaceholderText("Add new todo");

    fireEvent.change(input, { target: { value: "  New task  " } });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(vi.mocked(fetchModule.postFn)).toHaveBeenCalledWith({
        id: "1234567890",
        title: "New task", // Should be trimmed
        completed: false,
      });
    });
  });
});

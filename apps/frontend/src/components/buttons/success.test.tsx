import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuccessButton } from "./success"; // Adjust the import path if needed

describe("SuccessButton", () => {
  it("renders with the correct text content", () => {
    render(<SuccessButton disabled={false} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Add Todo");
  });

  it('has the correct type attribute set to "submit"', () => {
    render(<SuccessButton disabled={false} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("has the correct classes applied", () => {
    render(<SuccessButton disabled={false} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("border-gray-300");
    expect(button).toHaveClass("text-black");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("rounded");
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass("hover:bg-green-500");
    expect(button).toHaveClass("hover:text-white");
  });

  it("is not disabled when disabled prop is false", () => {
    render(<SuccessButton disabled={false} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    expect(button).not.toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<SuccessButton disabled={true} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    expect(button).toBeDisabled();
  });

  it("can be clicked when not disabled", async () => {
    const user = userEvent.setup();
    render(<SuccessButton disabled={false} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    await user.click(button);

    // Note: Since we don't have an onClick handler to test,
    // we're just verifying that clicking doesn't throw an error
    expect(button).toBeInTheDocument();
  });

  it("cannot be clicked when disabled", async () => {
    const user = userEvent.setup();
    render(<SuccessButton disabled={true} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    await user.click(button);

    // The button should still be disabled after attempting to click
    expect(button).toBeDisabled();
  });
});

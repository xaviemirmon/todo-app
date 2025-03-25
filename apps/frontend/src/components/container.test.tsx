import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./container"; // Adjust the import path if necessary

// Mock the Footer component
vi.mock("./footer", () => ({
  Footer: () => <div data-testid="footer-component">Footer Mock</div>,
}));

describe("Container", () => {
  it("renders the component with correct structure", () => {
    // Arrange
    const testChildContent = "Test Child Content";

    // Act
    render(
      <Container>
        <div data-testid="test-child">{testChildContent}</div>
      </Container>,
    );

    // Assert
    // Check if the header text is rendered
    expect(screen.getByText("My Todos")).toBeInTheDocument();

    // Check if the child content is rendered
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText(testChildContent)).toBeInTheDocument();

    // Check if the Footer component is rendered
    expect(screen.getByTestId("footer-component")).toBeInTheDocument();

    // Check if the main wrapper has the correct classes
    const mainWrapper = screen.getByText("My Todos").parentElement;
    expect(mainWrapper).toHaveClass("flex", "flex-col", "bg-blue-600");

    // Check if the content container has the correct classes
    const contentContainer = screen
      .getByTestId("test-child")
      .closest("div.bg-white");
    expect(contentContainer).toHaveClass("bg-white", "rounded-lg");
  });

  it("passes children to the appropriate container", () => {
    // Arrange
    const testId = "child-component";
    const testContent = "Child Component Content";

    // Act
    render(
      <Container>
        <div data-testid={testId}>{testContent}</div>
      </Container>,
    );

    // Assert
    const childrenContainer = screen.getByTestId(testId).parentElement;
    expect(childrenContainer).toHaveClass("overflow-auto", "flex", "flex-col");
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});

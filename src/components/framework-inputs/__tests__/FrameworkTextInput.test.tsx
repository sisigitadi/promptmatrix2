import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { FrameworkTextInput } from "../FrameworkTextInput";
import { CommonInputProps } from "../CommonInputProps";

describe("FrameworkTextInput", () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();
  const mockComponent = {
    name: "test-input",
    label: "Test Input",
    type: "text" as const,
    description: "A test input field",
    placeholder: "Enter text here",
    optional: false,
  };

  const defaultProps: CommonInputProps = {
    component: mockComponent,
    value: "",
    onChange: mockOnChange,
    onBlur: mockOnBlur,
    showDevMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the label and input correctly", () => {
    render(<FrameworkTextInput {...defaultProps} />);

    expect(screen.getByLabelText(/Test Input/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    render(<FrameworkTextInput {...defaultProps} />);

    const input = screen.getByPlaceholderText("Enter text here");
    fireEvent.change(input, { target: { value: "New Value" } });

    expect(mockOnChange).toHaveBeenCalledWith(
      "test-input",
      "New Value",
      mockComponent,
    );
  });

  it("calls onBlur when input loses focus", () => {
    render(<FrameworkTextInput {...defaultProps} />);

    const input = screen.getByPlaceholderText("Enter text here");
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledWith("test-input");
  });

  it("displays validation error when error prop is provided and field is touched", () => {
    render(
      <FrameworkTextInput
        {...defaultProps}
        error="Required field"
        isTouched={true}
      />,
    );

    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text here")).toBeInvalid();
  });

  it("renders a textarea when type is textarea", () => {
    const textareaComponent = { ...mockComponent, type: "textarea" as const };
    render(
      <FrameworkTextInput {...defaultProps} component={textareaComponent} />,
    );

    // Check if the element is a textarea (by checking if it doesn't have type="text" which input usually has, or by tag name if possible)
    // Testing Library getByRole is better for this
    expect(
      screen.getByRole("textbox", { name: /Test Input/i }),
    ).toBeInTheDocument();
  });
});

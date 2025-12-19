import React from "react";
import { Form } from "react-bootstrap";
import { CommonInputProps } from "./CommonInputProps";
import { FaToggleOn } from "react-icons/fa";

export const FrameworkBooleanInput: React.FC<CommonInputProps> = ({
  component,
  value,
  onChange,
  onBlur,
  error,
  isTouched,
}) => {
  const { name, label, description } = component;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.checked, component);
  };

  return (
    <Form.Group className="mb-3" controlId={name}>
      <div className="d-flex align-items-center">
        <FaToggleOn className="me-2" />
        <Form.Check
          type="checkbox"
          id={name}
          name={name}
          label={label || description || name}
          checked={!!value}
          onChange={handleChange}
          onBlur={() => onBlur(name)}
          isInvalid={isTouched && !!error}
        />
        <Form.Control.Feedback
          type="invalid"
          className={error ? "d-block" : ""}
        >
          {error || " "}
        </Form.Control.Feedback>
      </div>
    </Form.Group>
  );
};

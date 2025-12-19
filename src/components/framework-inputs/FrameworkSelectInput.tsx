import React from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CommonInputProps } from "./CommonInputProps";
import { FaMousePointer, FaInfoCircle } from "react-icons/fa";

export const FrameworkSelectInput: React.FC<CommonInputProps> = ({
  component,
  value,
  onChange,
  onBlur,
  error,
  isTouched,
  customValue,
  onCustomChange,
}) => {
  const { name, label, type, description, info, optional, options } = component;
  const isMulti = type === "multiselect";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      );
      onChange(name, selectedValues, component);
    } else {
      onChange(name, e.target.value, component);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCustomChange) {
      onCustomChange(name, e.target.value, component);
    }
  };

  const showCustomInput = () => {
    if (isMulti && Array.isArray(value)) {
      return value.includes("Lainnya...");
    }
    return value === "Lainnya...";
  };

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label className="small mb-1 d-flex align-items-center">
        <FaMousePointer className="me-2" />
        {label || description || name}
        {info && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{info}</Tooltip>}
          >
            <FaInfoCircle className="ms-2" style={{ cursor: "help" }} />
          </OverlayTrigger>
        )}
        {optional && <span className="ms-1 text-muted">(Opsional)</span>}
      </Form.Label>

      <InputGroup className="flex-grow-1">
        <Form.Select
          name={name}
          value={value || (isMulti ? [] : "")}
          onChange={handleChange}
          onBlur={() => onBlur(name)}
          multiple={isMulti}
          isInvalid={isTouched && !!error}
        >
          {!isMulti && <option value="">Pilih...</option>}
          {options?.map((option: any) => {
            const optValue = typeof option === "string" ? option : option.value;
            const optLabel = typeof option === "string" ? option : option.label;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </InputGroup>

      {showCustomInput() && (
        <Form.Group className="mt-2" controlId={`${name}-custom`}>
          <Form.Control
            type="text"
            placeholder={`Sebutkan ${label} Lainnya`}
            value={customValue || ""}
            onChange={handleCustomChange}
            onBlur={() => onBlur(`${name}-custom`)}
            isInvalid={isTouched && !!error} // Simplified validation logic for custom input reuse
          />
        </Form.Group>
      )}
    </Form.Group>
  );
};

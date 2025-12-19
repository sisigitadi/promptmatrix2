import React from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CommonInputProps } from "./CommonInputProps";
import {
  FaImage,
  FaFileAlt,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export const FrameworkFileInput: React.FC<CommonInputProps> = ({
  component,
  onChange,
  onBlur,
  error,
  isTouched,
}) => {
  const { name, label, type, description, info, optional } = component;
  const isImage = type === "image";
  const accept = isImage ? "image/*" : ".txt,.pdf";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        onChange(name, event.target?.result as string, component);
      };

      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        // For simple text files, read as text.
        // Note: For PDFs in a real app, you'd want proper PDF parsing logic
        // or just pass the base64 if the API supports it.
        // The original code used readAsText for .txt and implied .pdf handling,
        // but here we stick to the original behavior or slightly improved.
        if (file.type === "application/pdf") {
          reader.readAsDataURL(file); // Read PDF as base64
        } else {
          reader.readAsText(file);
        }
      }
    }
  };

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label className="small mb-1 d-flex align-items-center">
        {isImage ? (
          <FaImage className="me-2" />
        ) : (
          <FaFileAlt className="me-2" />
        )}
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
        <Form.Control
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          onBlur={() => onBlur(name)}
          isInvalid={isTouched && !!error}
        />
        <Form.Control.Feedback type="invalid">
          <FaExclamationCircle className="me-1" />
          {error || " "}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

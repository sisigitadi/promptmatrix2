import React from "react";
import {
  Form,
  InputGroup,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { CommonInputProps } from "./CommonInputProps";
import {
  FaCode,
  FaInfoCircle,
  FaTimesCircle,
  FaMagic,
  FaExclamationCircle,
} from "react-icons/fa";

export const FrameworkCodeInput: React.FC<CommonInputProps> = ({
  component,
  value,
  onChange,
  onBlur,
  error,
  isTouched,
  showDevMode,
  onAiAssist,
  isAiAssisting,
}) => {
  const { name, label, placeholder, description, info, optional } = component;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, e.target.value, component);
  };

  const handleClear = () => {
    onChange(name, "", component);
  };

  const rows = Math.max(5, (value || "").split("\n").length + 1);

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label className="small mb-1 d-flex align-items-center">
        <FaCode className="me-2" />
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

      <div className="d-flex align-items-center">
        <InputGroup className="flex-grow-1">
          <Form.Control
            as="textarea"
            id={name}
            name={name}
            placeholder={placeholder}
            value={value || ""}
            onChange={handleChange}
            onBlur={() => onBlur(name)}
            rows={rows}
            className="font-monospace"
            isInvalid={isTouched && !!error}
          />
          {value && (
            <Button
              variant="outline-secondary"
              onClick={handleClear}
              title="Hapus Input"
            >
              <FaTimesCircle />
            </Button>
          )}
          <Form.Control.Feedback type="invalid">
            <FaExclamationCircle className="me-1" />
            {error || " "}
          </Form.Control.Feedback>
        </InputGroup>

        {showDevMode && onAiAssist && (
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={() => onAiAssist(name, value || "", component, "code")}
            disabled={isAiAssisting}
            title="AI Assist"
          >
            {isAiAssisting ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <FaMagic />
            )}
          </Button>
        )}
      </div>
    </Form.Group>
  );
};

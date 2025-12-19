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
  FaKeyboard,
  FaHashtag,
  FaCalendarAlt,
  FaPalette,
  FaSlidersH,
  FaBan,
  FaInfoCircle,
  FaTimesCircle,
  FaMagic,
  FaExclamationCircle,
} from "react-icons/fa";

export const FrameworkTextInput: React.FC<CommonInputProps> = ({
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
  const {
    name,
    label,
    type,
    placeholder,
    description,
    info,
    optional,
    min,
    max,
    step,
  } = component;

  const getIcon = () => {
    switch (type) {
      case "number":
        return <FaHashtag className="me-2" />;
      case "date":
      case "datetime":
        return <FaCalendarAlt className="me-2" />;
      case "color":
        return <FaPalette className="me-2" />;
      case "slider":
        return <FaSlidersH className="me-2" />;
      case "negative_prompt":
        return <FaBan className="me-2" />;
      default:
        return <FaKeyboard className="me-2" />;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(name, e.target.value, component);
  };

  const handleClear = () => {
    onChange(name, "", component);
  };

  const renderInput = () => {
    if (type === "slider") {
      return (
        <Form.Range
          id={name}
          name={name}
          min={min || 0}
          max={max || 100}
          step={step || 1}
          value={value || min || 0}
          onChange={handleChange}
          onBlur={() => onBlur(name)}
          isInvalid={isTouched && !!error}
        />
      );
    }

    const asType =
      type === "textarea" || type === "negative_prompt" ? "textarea" : "input";
    const inputType =
      type === "text" || type === "negative_prompt" || type === "textarea"
        ? "text"
        : type;

    // Calculate rows for textarea
    const rows =
      asType === "textarea"
        ? Math.max(
            type === "negative_prompt" ? 2 : 3,
            (value || "").split("\n").length + 1,
          )
        : undefined;

    return (
      <InputGroup className="flex-grow-1">
        <Form.Control
          as={asType}
          type={inputType}
          id={name}
          name={name}
          placeholder={
            placeholder ||
            (type === "negative_prompt"
              ? "Masukkan hal-hal yang ingin dihindari..."
              : "")
          }
          value={value || ""}
          onChange={handleChange}
          onBlur={() => onBlur(name)}
          rows={rows}
          isInvalid={isTouched && !!error}
          aria-invalid={isTouched && !!error}
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
    );
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label
        className="small mb-1 d-flex align-items-center"
        htmlFor={name}
      >
        {getIcon()}
        {label || description || name}
        {info && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${name}`}>{info}</Tooltip>}
          >
            <FaInfoCircle className="ms-2" style={{ cursor: "help" }} />
          </OverlayTrigger>
        )}
        {optional && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-opt-${name}`}>
                Bidang ini bersifat opsional.
              </Tooltip>
            }
          >
            <span className="ms-1 text-muted" style={{ cursor: "help" }}>
              (Opsional)
            </span>
          </OverlayTrigger>
        )}
      </Form.Label>

      <div className="d-flex align-items-center">
        {renderInput()}
        {showDevMode && onAiAssist && type !== "slider" && (
          <Button
            variant="outline-primary"
            className="ms-2"
            onClick={() => onAiAssist(name, value || "", component, type)}
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

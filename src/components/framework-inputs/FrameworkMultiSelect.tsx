import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";

interface FrameworkMultiSelectProps {
  compName: string;
  compLabel: string;
  compOptions: any[];
  formData: any;
  customInputs: any;
  inputDetails: any;
  handleInputChangeWithValidation: (
    name: string,
    value: any,
    details: any,
  ) => void;
  handleCustomInputChangeWithValidation: (
    name: string,
    value: string,
    details: any,
  ) => void;
  handleInputBlur: (name: string) => void;
  validationErrors: any;
  touchedFields: any;
}

const FrameworkMultiSelect: React.FC<FrameworkMultiSelectProps> = ({
  compName,
  compLabel,
  compOptions,
  formData,
  customInputs,
  inputDetails,
  handleInputChangeWithValidation,
  handleCustomInputChangeWithValidation,
  handleInputBlur,
  validationErrors,
  touchedFields,
}) => {
  const selectedValues = Array.isArray(formData[compName])
    ? formData[compName]
    : [];

  const handleRemove = (valToRemove: string) => {
    const newValues = selectedValues.filter((v: string) => v !== valToRemove);
    handleInputChangeWithValidation(compName, newValues, inputDetails);

    // Clear custom input if "Lainnya..." is removed
    if (valToRemove === "Lainnya...") {
      handleCustomInputChangeWithValidation(compName, "", inputDetails);
    }
  };

  const handleAdd = (valToAdd: string) => {
    if (!valToAdd) return;
    if (!selectedValues.includes(valToAdd)) {
      handleInputChangeWithValidation(
        compName,
        [...selectedValues, valToAdd],
        inputDetails,
      );
    }
  };

  const handleRandomSelect = () => {
    if (compOptions && compOptions.length > 0) {
      const count = Math.floor(Math.random() * 2) + 2; // Select 2-3 items
      const shuffled = [...compOptions].sort(() => 0.5 - Math.random());
      const selected = shuffled
        .slice(0, count)
        .map((opt) => (typeof opt === "string" ? opt : opt.value));

      const uniqueValues = [...new Set([...selectedValues, ...selected])];
      handleInputChangeWithValidation(compName, uniqueValues, inputDetails);
    }
  };

  return (
    <div className="w-100">
      {/* Selected Items Badges */}
      <div className="mb-2 d-flex flex-wrap gap-2">
        {selectedValues.map((val: string) => {
          // Logic Tampilan Badge: Jika "Lainnya..." dan ada isinya, tampilkan isinya saja.
          let displayLabel = val;
          const isCustom = val === "Lainnya...";
          if (isCustom && customInputs[compName]) {
            displayLabel = customInputs[compName];
          }

          return (
            <span
              key={val}
              className={`badge d-flex align-items-center p-2 rounded-pill ${
                isCustom && !customInputs[compName]
                  ? "bg-warning text-dark border border-warning" // Warn if empty custom
                  : "bg-primary bg-opacity-10 text-primary border border-primary"
              }`}
              style={{ fontSize: "0.9em", fontWeight: "normal" }}
            >
              <span
                className="me-1 text-truncate"
                style={{ maxWidth: "200px" }}
              >
                {displayLabel}
              </span>

              <span
                className="ms-2 fw-bold"
                style={{
                  cursor: "pointer",
                  fontSize: "1.2em",
                  lineHeight: 0.5,
                }}
                onClick={() => handleRemove(val)}
                title="Hapus"
              >
                ×
              </span>
            </span>
          );
        })}
      </div>

      {/* Adder Dropdown */}
      <InputGroup>
        <Form.Select
          id={compName}
          name={compName}
          value="" // Always reset to prompt user to select another
          onChange={(e) => handleAdd(e.target.value)}
          onBlur={() => handleInputBlur(compName)}
          className="form-select"
          isInvalid={touchedFields[compName] && !!validationErrors[compName]}
        >
          <option value="">+ Tambahkan {compLabel}...</option>
          {compOptions?.map((opt: any) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;

            // Hide if already selected
            if (selectedValues.includes(value)) return null;

            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Form.Select>

        <Button
          variant="outline-secondary"
          onClick={handleRandomSelect}
          title="Pilih acak beberapa items"
          className="interactive-input ms-1"
        >
          🎲
        </Button>
      </InputGroup>

      {/* Validation Feedback */}
      <div className="invalid-feedback d-block">
        {validationErrors[compName] && (
          <>
            <FaExclamationCircle className="me-1" />
            {validationErrors[compName]}
          </>
        )}
      </div>

      {/* Custom Input for 'Lainnya...' with Enter Key Prevention */}
      {selectedValues.includes("Lainnya...") && (
        <Form.Group className="mt-2" controlId={`${compName}-custom`}>
          <Form.Control
            type="text"
            placeholder={`Sebutkan ${compLabel} lainnya...`}
            value={customInputs[compName] || ""}
            onChange={(e) =>
              handleCustomInputChangeWithValidation(
                compName,
                e.target.value,
                inputDetails,
              )
            }
            onKeyDown={(e) => {
              // Prevent form submission or reload on Enter
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            onBlur={() => handleInputBlur(`${compName}-custom`)}
            isInvalid={
              touchedFields[`${compName}-custom`] &&
              !!validationErrors[`${compName}-custom`]
            }
            className="border-primary"
            autoFocus
          />
          <Form.Text className="text-muted">
            Teks ini akan menggantikan label &quot;Lainnya...&quot; pada hasil
            akhir prompt.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {validationErrors[`${compName}-custom`]}
          </Form.Control.Feedback>
        </Form.Group>
      )}
    </div>
  );
};

export default FrameworkMultiSelect;

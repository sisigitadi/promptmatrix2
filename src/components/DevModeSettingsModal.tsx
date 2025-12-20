import React, { useState } from "react";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaCog, FaKey, FaSlidersH } from "react-icons/fa";

interface DevModeSettingsModalProps {
  show: boolean;
  onHide: () => void;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeyEnabled: boolean;

  formData: { [key: string]: any };
  handleInputChangeWithValidation: (
    name: string,
    value: string | number,
    inputDetails?: any,
  ) => void;
  validationErrors: { [key: string]: string };
}

const DevModeSettingsModal: React.FC<DevModeSettingsModalProps> = ({
  show,
  onHide,
  selectedModel,
  onModelSelect,
  apiKey,
  setApiKey,
  isApiKeyEnabled,

  formData,
  handleInputChangeWithValidation,
  validationErrors,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="modal-themed"
      size="lg"
    >
      <Modal.Header closeButton className="modal-header-themed border-bottom-0">
        <Modal.Title className="d-flex align-items-center gap-2 text-info">
          <FaCog /> Pengaturan Mode Pengembang
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-4">
        <Form>
          {/* SECTION: API CONFIGURATION */}
          <div className="mb-4 p-3 bg-dark-subtle rounded border border-secondary">
            <h6 className="text-info mb-3 d-flex align-items-center justify-content-between gap-2 small text-uppercase fw-bold">
              <span className="d-flex align-items-center gap-2">
                <FaKey size={14} /> Konfigurasi API
              </span>
              {isApiKeyEnabled ? (
                <span className="text-success" style={{ fontSize: "0.65rem" }}>
                  Status: Aktif
                </span>
              ) : (
                <span className="text-danger" style={{ fontSize: "0.65rem" }}>
                  Status: Nonaktif
                </span>
              )}
            </h6>

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted mb-1">
                Model Gemini Target
              </Form.Label>
              <Form.Select
                value={selectedModel}
                onChange={(e) => onModelSelect(e.target.value)}
                className="bg-dark text-light border-secondary"
              >
                <option value="gemini-3.0-pro">gemini-3.0-pro</option>
                <option value="gemini-3.0-flash">gemini-3.0-flash</option>
                <option value="gemini-3.0-deep-think">
                  gemini-3.0-deep-think
                </option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.0-pro">gemini-2.0-pro</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="small text-muted mb-1">
                Google API Key
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showApiKey ? "text" : "password"}
                  placeholder="Masukkan API Key Anda..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-dark text-light border-secondary"
                />
                <Button
                  variant="outline-secondary"
                  className="border-secondary"
                  onClick={() => setShowApiKey((prev) => !prev)}
                >
                  {showApiKey ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <div className="mt-2 p-2 bg-dark rounded border border-warning border-opacity-25">
                <p
                  className="small text-warning mb-0"
                  style={{ fontSize: "0.75rem" }}
                >
                  <strong>Keamanan:</strong> API Key disimpan di{" "}
                  <code>sessionStorage</code>. Kunci akan dihapus saat tab
                  browser ditutup. Jangan gunakan kunci produksi dengan kuota
                  tinggi.
                </p>
              </div>
            </Form.Group>
          </div>

          {/* SECTION: PARAMETERS */}
          <div className="p-3 bg-dark-subtle rounded border border-secondary">
            <h6 className="text-info mb-3 d-flex align-items-center gap-2 small text-uppercase fw-bold">
              <FaSlidersH size={14} /> Parameter Generasi
            </h6>

            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Temperature
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.7"
                    value={formData.temperature || ""}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        "temperature",
                        parseFloat(e.target.value),
                        { validation: { min_value: 0, max_value: 1 } },
                      )
                    }
                    isInvalid={!!validationErrors.temperature}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.temperature}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Top P
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.9"
                    value={formData.top_p || ""}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        "top_p",
                        parseFloat(e.target.value),
                        { validation: { min_value: 0, max_value: 1 } },
                      )
                    }
                    isInvalid={!!validationErrors.top_p}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.top_p}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Top K
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="40"
                    value={formData.top_k || ""}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        "top_k",
                        parseInt(e.target.value),
                        { validation: { min_value: 1 } },
                      )
                    }
                    isInvalid={!!validationErrors.top_k}
                    className="bg-dark text-light border-secondary"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.top_k}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed bg-dark border-top border-secondary mt-0">
        <Button variant="primary" onClick={onHide} className="px-5">
          Simpan & Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DevModeSettingsModal;

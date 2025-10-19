import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Accordion,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { Framework, FrameworkComponent } from "@/data/frameworks";
import { CATEGORY_ORDER, PROMPT_FRAMEWORKS } from "@/data/frameworks";
import { toast } from "react-toastify";
import {
  FaInfoCircle,
  FaIdCard,
  FaTag,
  FaFolderOpen,
  FaFileAlt,
  FaUser,
  FaRobot,
  FaAlignLeft,
  FaWrench,
  FaListOl,
  FaKeyboard,
  FaCheckSquare,
  FaQuestionCircle,
  FaMousePointer,
  FaLayerGroup,
  FaTasks,
  FaObjectGroup,
} from "react-icons/fa";

interface FrameworkBuilderModalProps {
  show: boolean;
  onHide: () => void;
  isLightTheme: boolean;
}

const initialComponentState: FrameworkComponent = {
  name: "",
  label: "",
  type: "text",
  description: "",
  default: "",
  optional: false,
  placeholder: "",
  info: "",
  options: [],
  validation: {},
};

const initialFrameworkState: Partial<Framework> = {
  id_kerangka: "",
  nama_kerangka: "",
  version: "1.0.0",
  kategori: ["", ""],
  description: "",
  perspektif_user: "",
  ai_logic_description: "",
  components: [],
  komponen_prompt: {
    PERAN: "",
    KONTEKS: "",
    TUGAS: "",
    FORMAT_OUTPUT: "",
  },
  toolType: "text",
  konteks_tambahan_instruksi_khusus: "",
  contoh_kalimat: "",
  output: "natural_language_prompt",
};

const FrameworkBuilderModal: React.FC<FrameworkBuilderModalProps> = ({
  show,
  onHide,
  isLightTheme,
}) => {
  const [framework, setFramework] = useState<Partial<Framework>>(
    initialFrameworkState,
  );
  const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>([]);
  const [generatedJson, setGeneratedJson] = useState<string>("");

  const handleHide = () => {
    setFramework(initialFrameworkState);
    setGeneratedJson("");
    onHide();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFramework((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromptComponentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFramework((prev) => ({
      ...prev,
      komponen_prompt: {
        ...prev.komponen_prompt,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newKategori = [...(framework.kategori || ["", ""])];
    newKategori[index] = value;

    if (index === 0) {
      newKategori[1] = "";
      const subs = value ? Object.keys(PROMPT_FRAMEWORKS[value] || {}) : [];
      setSubCategoryOptions(subs);
    }

    setFramework((prev) => ({
      ...prev,
      kategori: newKategori as [string, string],
    }));
  };

  const addComponent = () => {
    setFramework((prev) => ({
      ...prev,
      components: [
        ...(prev.components || []),
        { ...initialComponentState, options: [], validation: {} },
      ],
    }));
  };

  const removeComponent = (index: number) => {
    setFramework((prev) => ({
      ...prev,
      components: prev.components?.filter((_, i) => i !== index),
    }));
  };

  const handleComponentChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const inputValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;

    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    newComponents[index][name] = inputValue;
    setFramework((prev) => ({ ...prev, components: newComponents }));
  };

  const handleValidationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    if (!newComponents[index].validation) {
      newComponents[index].validation = {};
    }
    newComponents[index].validation[name] = value ? parseFloat(value) : null;
    setFramework((prev) => ({ ...prev, components: newComponents }));
  };

  const addOption = (componentIndex: number) => {
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    if (!newComponents[componentIndex].options) {
      newComponents[componentIndex].options = [];
    }
    newComponents[componentIndex].options.push("");
    setFramework((prev) => ({ ...prev, components: newComponents }));
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    newComponents[componentIndex].options.splice(optionIndex, 1);
    setFramework((prev) => ({ ...prev, components: newComponents }));
  };

  const handleOptionChange = (
    componentIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    newComponents[componentIndex].options[optionIndex] = value;
    setFramework((prev) => ({ ...prev, components: newComponents }));
  };

  const cleanupFramework = (fw: Partial<Framework>): Partial<Framework> => {
    const cleanedFw = JSON.parse(JSON.stringify(fw));

    if (cleanedFw.components) {
      cleanedFw.components.forEach((comp: FrameworkComponent) => {
        if (comp.type !== "select" && comp.type !== "multiselect") {
          delete comp.options;
        } else if (comp.options && comp.options.length === 0) {
          delete comp.options;
        }

        if (comp.type !== "number" && comp.type !== "slider") {
          delete comp.validation;
        } else if (comp.validation) {
          Object.keys(comp.validation).forEach((key) => {
            if (
              comp.validation[key] === null ||
              comp.validation[key] === "" ||
              isNaN(comp.validation[key])
            ) {
              delete comp.validation[key];
            }
          });
          if (Object.keys(comp.validation).length === 0) {
            delete comp.validation;
          }
        }
      });
    }

    return cleanedFw;
  };

  const handleGenerateJson = () => {
    const cleaned = cleanupFramework(framework);
    const jsonString = JSON.stringify(cleaned, null, 2);
    setGeneratedJson(jsonString);
    toast.success("JSON berhasil dibuat!");
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generatedJson).then(
      () => {
        toast.info("JSON disalin ke clipboard!");
      },
      (err) => {
        toast.error("Gagal menyalin JSON.");
        console.error("Could not copy text: ", err);
      },
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      size="xl"
      centered
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Framework Builder</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed text-start">
        <Form>
          <Accordion
            defaultActiveKey="0"
            alwaysOpen
            data-bs-theme={isLightTheme ? "light" : "dark"}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Informasi Dasar</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaInfoCircle className="me-2" />
                        Nama Kerangka
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nama_kerangka"
                        value={framework.nama_kerangka || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaIdCard className="me-2" />
                        ID Kerangka
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="id_kerangka"
                        value={framework.id_kerangka || ""}
                        onChange={handleInputChange}
                        placeholder="e.g., TKS-PIM-001"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaTag className="me-2" />
                        Versi
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="version"
                        value={framework.version || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaLayerGroup className="me-2" />
                        Kategori Utama
                      </Form.Label>
                      <Form.Select
                        value={framework.kategori?.[0] || ""}
                        onChange={(e) =>
                          handleCategoryChange(0, e.target.value)
                        }
                      >
                        <option value="">Pilih Kategori...</option>
                        {CATEGORY_ORDER.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="d-flex align-items-center">
                        <FaFolderOpen className="me-2" />
                        Sub-Kategori
                      </Form.Label>
                      <Form.Select
                        value={framework.kategori?.[1] || ""}
                        onChange={(e) =>
                          handleCategoryChange(1, e.target.value)
                        }
                        disabled={!framework.kategori?.[0]}
                      >
                        <option value="">Pilih Sub-Kategori...</option>
                        {subCategoryOptions.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaFileAlt className="me-2" />
                    Deskripsi
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={framework.description || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    Perspektif User
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="perspektif_user"
                    value={framework.perspektif_user || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaRobot className="me-2" />
                    Deskripsi Logika AI
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="ai_logic_description"
                    value={framework.ai_logic_description || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Komponen Prompt</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaRobot className="me-2" />
                    Peran AI
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="PERAN"
                    value={framework.komponen_prompt?.PERAN || ""}
                    onChange={handlePromptComponentChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaObjectGroup className="me-2" />
                    Konteks
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="KONTEKS"
                    value={framework.komponen_prompt?.KONTEKS || ""}
                    onChange={handlePromptComponentChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaTasks className="me-2" />
                    Tugas
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="TUGAS"
                    value={framework.komponen_prompt?.TUGAS || ""}
                    onChange={handlePromptComponentChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center">
                    <FaAlignLeft className="me-2" />
                    Format Output
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="FORMAT_OUTPUT"
                    value={framework.komponen_prompt?.FORMAT_OUTPUT || ""}
                    onChange={handlePromptComponentChange}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                Komponen Input User (Formulir)
              </Accordion.Header>
              <Accordion.Body>
                <Accordion data-bs-theme={isLightTheme ? "light" : "dark"}>
                  {framework.components?.map((component, index) => (
                    <Accordion.Item key={index} eventKey={`component-${index}`}>
                      <Accordion.Header>
                        {`Komponen #${index + 1}: ${component.label || "(baru)"}`}
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="d-flex align-items-center">
                                <FaWrench className="me-2" />
                                Name (Variable)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={component.name}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="d-flex align-items-center">
                                <FaTag className="me-2" />
                                Label (Tampilan)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="label"
                                value={component.label}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaMousePointer className="me-2" />
                            Tipe Komponen
                          </Form.Label>
                          <Form.Select
                            name="type"
                            value={component.type}
                            onChange={(e) => handleComponentChange(index, e)}
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Textarea</option>
                            <option value="number">Number</option>
                            <option value="select">Select (Dropdown)</option>
                            <option value="multiselect">Multi-select</option>
                            <option value="boolean">Boolean (Checkbox)</option>
                            <option value="slider">Slider</option>
                            <option value="code">Code</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaFileAlt className="me-2" />
                            Deskripsi
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={component.description}
                            onChange={(e) => handleComponentChange(index, e)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaQuestionCircle className="me-2" />
                            Info (Tooltip)
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="info"
                            value={component.info}
                            onChange={(e) => handleComponentChange(index, e)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="d-flex align-items-center">
                            <FaKeyboard className="me-2" />
                            Placeholder
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="placeholder"
                            value={component.placeholder}
                            onChange={(e) => handleComponentChange(index, e)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            name="optional"
                            label="Opsional"
                            checked={component.optional}
                            onChange={(e) => handleComponentChange(index, e)}
                          />
                        </Form.Group>

                        {(component.type === "select" ||
                          component.type === "multiselect") && (
                          <div className="p-3 mt-3 border rounded">
                            <h6>
                              <FaListOl className="me-2" />
                              Opsi Pilihan
                            </h6>
                            {component.options?.map((option, optIndex) => (
                              <InputGroup className="mb-2" key={optIndex}>
                                <Form.Control
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(index, optIndex, e)
                                  }
                                />
                                <Button
                                  variant="outline-danger"
                                  onClick={() => removeOption(index, optIndex)}
                                >
                                  Hapus
                                </Button>
                              </InputGroup>
                            ))}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => addOption(index)}
                            >
                              + Tambah Opsi
                            </Button>
                          </div>
                        )}

                        {(component.type === "number" ||
                          component.type === "slider") && (
                          <div className="p-3 mt-3 border rounded">
                            <h6>
                              <FaCheckSquare className="me-2" />
                              Aturan Validasi Angka
                            </h6>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Nilai Minimum</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="min_value"
                                    value={
                                      component.validation?.min_value || ""
                                    }
                                    onChange={(e) =>
                                      handleValidationChange(index, e)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Label>Nilai Maksimum</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="max_value"
                                    value={
                                      component.validation?.max_value || ""
                                    }
                                    onChange={(e) =>
                                      handleValidationChange(index, e)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}

                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-3"
                          onClick={() => removeComponent(index)}
                        >
                          Hapus Komponen Ini
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
                <Button
                  variant="outline-success"
                  className="mt-3"
                  onClick={addComponent}
                >
                  + Tambah Komponen
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>

        {generatedJson && (
          <div className="mt-4">
            <h5>Generated JSON Output</h5>
            <Alert variant="info" className="position-relative">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCopyJson}
                className="position-absolute top-0 end-0 me-2 mt-2"
                style={{ zIndex: 5 }}
              >
                <i className="bi bi-clipboard"></i> Salin
              </Button>
              <pre>
                <code>{generatedJson}</code>
              </pre>
            </Alert>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleGenerateJson}>
          Generate JSON
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FrameworkBuilderModal;

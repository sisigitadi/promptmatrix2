import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Accordion,
  InputGroup,
} from "react-bootstrap";
import { Framework, FrameworkComponent } from "@/data/frameworks";
import { CATEGORY_ORDER, PROMPT_FRAMEWORKS } from "@/data/frameworks";
import { toast } from "react-toastify";
import {
  FaInfoCircle,
  FaRobot,
  FaWrench,
  FaListOl,
  FaPlus,
  FaTrash,
  FaCode,
  FaCopy,
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
    setFramework((prev: Partial<Framework>) => ({ ...prev, [name]: value }));
  };

  const handlePromptComponentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFramework((prev: Partial<Framework>) => ({
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

    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      kategori: newKategori as [string, string],
    }));
  };

  const addComponent = () => {
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: [
        ...(prev.components || []),
        { ...initialComponentState, options: [], validation: {} },
      ],
    }));
  };

  const removeComponent = (index: number) => {
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: prev.components?.filter((_: any, i: number) => i !== index),
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
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: newComponents,
    }));
  };

  /* handleValidationChange was unused and causing a warning. Removed or commented out. */
  /*
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
    setFramework((prev: Partial<Framework>) => ({ ...prev, components: newComponents }));
  };
  */

  const addOption = (componentIndex: number) => {
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    if (!newComponents[componentIndex].options) {
      newComponents[componentIndex].options = [];
    }
    newComponents[componentIndex].options.push("");
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: newComponents,
    }));
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    newComponents[componentIndex].options.splice(optionIndex, 1);
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: newComponents,
    }));
  };

  const handleOptionChange = (
    componentIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    const newComponents = JSON.parse(
      JSON.stringify(framework.components || []),
    );
    newComponents[componentIndex].options[optionIndex] = value;
    setFramework((prev: Partial<Framework>) => ({
      ...prev,
      components: newComponents,
    }));
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
              (comp.validation as any)[key] === null ||
              (comp.validation as any)[key] === "" ||
              isNaN((comp.validation as any)[key])
            ) {
              delete (comp.validation as any)[key];
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
      scrollable
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaWrench /> Framework Builder
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed">
        <Form>
          <Accordion defaultActiveKey="0" alwaysOpen className="mb-4" flush>
            {/* SECTION 1: METADATA */}
            <Accordion.Item
              eventKey="0"
              className="border-bottom border-secondary"
            >
              <Accordion.Header>
                <FaInfoCircle className="me-2" /> Informasi Dasar
              </Accordion.Header>
              <Accordion.Body className="bg-dark-subtle">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Nama Kerangka
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nama_kerangka"
                        value={framework.nama_kerangka || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        ID (e.g., TKS-001)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="id_kerangka"
                        value={framework.id_kerangka || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary font-monospace"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Versi
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="version"
                        value={framework.version || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary font-monospace"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Kategori Utama
                      </Form.Label>
                      <Form.Select
                        value={framework.kategori?.[0] || ""}
                        onChange={(e) =>
                          handleCategoryChange(0, e.target.value)
                        }
                        className="bg-dark text-light border-secondary"
                      >
                        <option value="">Pilih...</option>
                        {CATEGORY_ORDER.map((cat: string) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Sub-Kategori
                      </Form.Label>
                      <Form.Select
                        value={framework.kategori?.[1] || ""}
                        onChange={(e) =>
                          handleCategoryChange(1, e.target.value)
                        }
                        disabled={!framework.kategori?.[0]}
                        className="bg-dark text-light border-secondary"
                      >
                        <option value="">Pilih...</option>
                        {subCategoryOptions.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Deskripsi Singkat
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        value={framework.description || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Perspektif User (User Story)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="perspektif_user"
                        value={framework.perspektif_user || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Deskripsi Logika AI
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="ai_logic_description"
                        value={framework.ai_logic_description || ""}
                        onChange={handleInputChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* SECTION 2: PROMPT STRUCTURE */}
            <Accordion.Item
              eventKey="1"
              className="border-bottom border-secondary"
            >
              <Accordion.Header>
                <FaRobot className="me-2" /> Struktur Prompt (System)
              </Accordion.Header>
              <Accordion.Body className="bg-dark-subtle">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Peran (Role)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="PERAN"
                        value={framework.komponen_prompt?.PERAN || ""}
                        onChange={handlePromptComponentChange}
                        className="bg-dark text-light border-secondary"
                        placeholder="e.g., Anda adalah ahli..."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Konteks (Context)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="KONTEKS"
                        value={framework.komponen_prompt?.KONTEKS || ""}
                        onChange={handlePromptComponentChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Tugas (Task)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="TUGAS"
                        value={framework.komponen_prompt?.TUGAS || ""}
                        onChange={handlePromptComponentChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">
                        Format Output
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="FORMAT_OUTPUT"
                        value={framework.komponen_prompt?.FORMAT_OUTPUT || ""}
                        onChange={handlePromptComponentChange}
                        className="bg-dark text-light border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* SECTION 3: INPUT COMPONENTS */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <FaListOl className="me-2" /> Komponen Input (Formulir)
              </Accordion.Header>
              <Accordion.Body className="bg-dark-subtle">
                <div className="d-flex flex-column gap-3">
                  {framework.components?.map(
                    (component: FrameworkComponent, index: number) => (
                      <div
                        key={index}
                        className="border border-secondary rounded p-3 bg-dark"
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0 text-info">
                            Komponen #{index + 1}
                          </h6>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeComponent(index)}
                            title="Hapus Komponen"
                          >
                            <FaTrash />
                          </Button>
                        </div>

                        <Row className="g-3">
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small text-muted mb-1">
                                Tipe Input
                              </Form.Label>
                              <Form.Select
                                name="type"
                                value={component.type}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                                className="bg-secondary text-light border-0"
                                size="sm"
                              >
                                <option value="text">Text (Singkat)</option>
                                <option value="textarea">
                                  Textarea (Panjang)
                                </option>
                                <option value="number">Number (Angka)</option>
                                <option value="select">
                                  Select (Dropdown)
                                </option>
                                <option value="multiselect">
                                  Multi-select
                                </option>
                                <option value="boolean">
                                  Boolean (Switch)
                                </option>
                                <option value="slider">Slider (Geser)</option>
                                <option value="code">Code (Editor)</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small text-muted mb-1">
                                Variable Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={component.name}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                                size="sm"
                                className="bg-dark text-light border-secondary font-monospace"
                                placeholder="MY_VARIABLE"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small text-muted mb-1">
                                Label Tampilan
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="label"
                                value={component.label}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                                size="sm"
                                className="bg-dark text-light border-secondary"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="small text-muted mb-1">
                                Tooltip Info
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="info"
                                value={component.info}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                                size="sm"
                                className="bg-dark text-light border-secondary"
                                placeholder="Penjelasan singkat saat user hover icon info..."
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="small text-muted mb-1">
                                Placeholder
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="placeholder"
                                value={component.placeholder}
                                onChange={(e) =>
                                  handleComponentChange(index, e)
                                }
                                size="sm"
                                className="bg-dark text-light border-secondary"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={6} className="d-flex align-items-end">
                            <Form.Check
                              type="switch"
                              name="optional"
                              label="Input ini opsional"
                              checked={component.optional}
                              onChange={(e) => handleComponentChange(index, e)}
                              className=""
                            />
                          </Col>

                          {/* CONDITIONAL OPTIONS FOR SELECT */}
                          {(component.type === "select" ||
                            component.type === "multiselect") && (
                            <Col md={12}>
                              <div className="p-2 border border-secondary rounded bg-dark-subtle">
                                <label className="small text-muted mb-2 d-block">
                                  Opsi Pilihan:
                                </label>
                                {component.options?.map(
                                  (
                                    option:
                                      | string
                                      | { label: string; value: string },
                                    optIndex: number,
                                  ) => (
                                    <InputGroup
                                      className="mb-2"
                                      key={optIndex}
                                      size="sm"
                                    >
                                      <Form.Control
                                        type="text"
                                        value={
                                          typeof option === "string"
                                            ? option
                                            : option.value
                                        }
                                        onChange={(e) =>
                                          handleOptionChange(index, optIndex, e)
                                        }
                                        className="bg-dark text-light border-secondary"
                                      />
                                      <Button
                                        variant="outline-danger"
                                        onClick={() =>
                                          removeOption(index, optIndex)
                                        }
                                      >
                                        <FaTrash />
                                      </Button>
                                    </InputGroup>
                                  ),
                                )}
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => addOption(index)}
                                  className="w-100"
                                >
                                  <FaPlus className="me-1" /> Tambah Opsi
                                </Button>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </div>
                    ),
                  )}

                  <Button
                    variant="success"
                    onClick={addComponent}
                    className="py-2"
                  >
                    <FaPlus className="me-2" /> Tambah Komponen Baru
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>

        {generatedJson && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0 text-info">
                <FaCode className="me-2" /> JSON Result
              </h5>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleCopyJson}
              >
                <FaCopy className="me-1" /> Salin JSON
              </Button>
            </div>
            <div className="position-relative">
              <pre
                className="bg-dark p-3 rounded border border-secondary text-info mb-0"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <code>{generatedJson}</code>
              </pre>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed justify-content-between">
        <Button variant="outline-secondary" onClick={onHide}>
          Batal
        </Button>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={handleGenerateJson}
            disabled={!framework.nama_kerangka}
          >
            Generate Framework JSON
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FrameworkBuilderModal;

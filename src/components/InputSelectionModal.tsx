import React, { useState, useMemo } from "react";
import { FaTimesCircle, FaSearch, FaArrowRight, FaLink } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Accordion,
  InputGroup,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { PROMPT_FRAMEWORKS, Framework } from "../data/frameworks";
import { categoryCssNameMap } from "../utils/categoryUtils";

interface InputSelectionModalProps {
  show: boolean;
  onHide: () => void;
  outputToChain: string;
  onSelectInput: (
    frameworkName: string,
    inputName: string,
    inputValue: string,
  ) => void;
}

interface FlatFramework {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  details: Framework;
}

const InputSelectionModal: React.FC<InputSelectionModalProps> = ({
  show,
  onHide,
  outputToChain,
  onSelectInput,
}) => {
  const [selectedFrameworkName, setSelectedFrameworkName] = useState<
    string | null
  >(null);
  const [selectedInputName, setSelectedInputName] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleFrameworkSelect = (frameworkName: string) => {
    setSelectedFrameworkName(frameworkName);
    setSelectedInputName(null);
  };

  const handleInputSelect = (inputName: string) => {
    setSelectedInputName(inputName);
  };

  const handleConfirm = () => {
    if (selectedFrameworkName && selectedInputName) {
      onSelectInput(selectedFrameworkName, selectedInputName, outputToChain);
      onHide();
    }
  };

  const flatFrameworks = useMemo(() => {
    const allFrameworks: FlatFramework[] = [];
    Object.entries(PROMPT_FRAMEWORKS).forEach(
      ([categoryName, subcategories]) => {
        Object.entries(subcategories).forEach(
          ([subcategoryName, frameworks]) => {
            Object.entries(frameworks).forEach(
              ([frameworkName, frameworkDetails]) => {
                allFrameworks.push({
                  name: frameworkName,
                  description: frameworkDetails.description,
                  category: categoryName,
                  subcategory: subcategoryName,
                  details: frameworkDetails,
                });
              },
            );
          },
        );
      },
    );
    return allFrameworks;
  }, []);

  const searchResults = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    if (!searchTerm) return [];
    return flatFrameworks.filter(
      (fw) =>
        fw.name.toLowerCase().includes(searchTerm) ||
        fw.description.toLowerCase().includes(searchTerm) ||
        fw.category.toLowerCase().includes(searchTerm) ||
        fw.subcategory.toLowerCase().includes(searchTerm) ||
        fw.details.components?.some(
          (comp) =>
            comp.name.toLowerCase().includes(searchTerm) ||
            comp.label.toLowerCase().includes(searchTerm),
        ),
    );
  }, [searchQuery, flatFrameworks]);

  const getFrameworkDetails = (name: string): Framework | undefined => {
    return flatFrameworks.find((fw) => fw.name === name)?.details;
  };

  const currentFrameworkDetails = selectedFrameworkName
    ? getFrameworkDetails(selectedFrameworkName)
    : undefined;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="modal-themed"
      scrollable
    >
      <Modal.Header closeButton className="modal-header-themed border-bottom-0">
        <Modal.Title className="d-flex align-items-center gap-2 text-info">
          <FaLink /> Hubungkan Output ke Input
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-0">
        <div className="p-3 bg-dark border-bottom border-secondary">
          <InputGroup>
            <InputGroup.Text className="bg-dark text-info border-secondary border-end-0">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cari kerangka kerja target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark text-light border-secondary border-start-0 ps-0"
            />
            {searchQuery && (
              <Button
                variant="outline-secondary"
                className="border-secondary"
                onClick={() => setSearchQuery("")}
              >
                <FaTimesCircle />
              </Button>
            )}
          </InputGroup>
        </div>

        <Row className="g-0" style={{ height: "65vh" }}>
          {/* LEFT PANE: FRAMEWORK SELECTION */}
          <Col
            md={6}
            className="border-end border-secondary d-flex flex-column h-100"
          >
            <div className="p-3 bg-dark-subtle border-bottom border-secondary">
              <h6 className="mb-0 small text-uppercase letter-spacing-1 text-muted">
                1. Pilih Kerangka Kerja
              </h6>
            </div>
            <div className="flex-grow-1 overflow-auto p-3 custom-scrollbar">
              {searchQuery.length > 0 ? (
                <ListGroup variant="flush">
                  {searchResults.map((fw) => (
                    <ListGroup.Item
                      key={fw.name}
                      action
                      active={selectedFrameworkName === fw.name}
                      onClick={() => handleFrameworkSelect(fw.name)}
                      className="bg-transparent border-0 rounded mb-1 p-3 list-item-chain"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold text-light">{fw.name}</div>
                          <div className="small text-muted">
                            {fw.category} &rsaquo; {fw.subcategory}
                          </div>
                        </div>
                        {selectedFrameworkName === fw.name && (
                          <FaArrowRight className="text-info" />
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Accordion className="chain-accordion" flush>
                  {Object.entries(PROMPT_FRAMEWORKS)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([categoryName, subcategories]) => (
                      <Accordion.Item
                        eventKey={categoryName}
                        key={categoryName}
                        className="bg-transparent border-0"
                      >
                        <Accordion.Header
                          className={`category-link ${categoryCssNameMap[categoryName]}`}
                        >
                          {categoryName}
                        </Accordion.Header>
                        <Accordion.Body className="p-0">
                          {Object.entries(subcategories).map(
                            ([subcategoryName, frameworks]) => (
                              <div key={subcategoryName}>
                                <div className="px-4 py-2 bg-dark text-muted small text-uppercase fw-bold border-bottom border-secondary opacity-50">
                                  {subcategoryName}
                                </div>
                                {Object.entries(frameworks).map(
                                  ([frameworkName]) => (
                                    <ListGroup.Item
                                      key={frameworkName}
                                      action
                                      active={
                                        selectedFrameworkName === frameworkName
                                      }
                                      onClick={() =>
                                        handleFrameworkSelect(frameworkName)
                                      }
                                      className="ps-5 bg-transparent border-0 list-item-chain"
                                    >
                                      {frameworkName}
                                    </ListGroup.Item>
                                  ),
                                )}
                              </div>
                            ),
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                </Accordion>
              )}
            </div>
          </Col>

          {/* RIGHT PANE: INPUT FIELD SELECTION */}
          <Col md={6} className="d-flex flex-column h-100 bg-dark-subtle">
            <div className="p-3 bg-dark border-bottom border-secondary">
              <h6 className="mb-0 small text-uppercase letter-spacing-1 text-muted">
                2. Pilih Input Tujuan
              </h6>
            </div>
            <div className="flex-grow-1 overflow-auto p-3 custom-scrollbar">
              {!selectedFrameworkName ? (
                <div className="h-100 d-flex flex-column justify-content-center align-items-center text-muted opacity-50 p-5 text-center">
                  <FaLink size={40} className="mb-3" />
                  <p>
                    Silakan pilih kerangka kerja di panel kiri untuk melihat
                    daftar input yang tersedia.
                  </p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {currentFrameworkDetails?.components?.map((comp) => (
                    <ListGroup.Item
                      key={comp.name}
                      action
                      active={selectedInputName === comp.name}
                      onClick={() => handleInputSelect(comp.name)}
                      className="bg-dark border border-secondary rounded mb-2 p-3 list-item-field"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold text-info">{comp.label}</div>
                          <code className="small text-secondary">
                            {comp.name}
                          </code>
                          <div className="small text-muted mt-1">
                            {comp.type} input
                          </div>
                        </div>
                        {selectedInputName === comp.name && (
                          <Badge bg="info" pill>
                            Terpilih
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed border-top border-secondary bg-dark">
        <div className="me-auto text-muted small d-none d-md-block">
          {selectedFrameworkName && selectedInputName && (
            <span>
              Menghubungkan ke: <strong>{selectedFrameworkName}</strong>{" "}
              &rsaquo; <strong>{selectedInputName}</strong>
            </span>
          )}
        </div>
        <Button variant="outline-secondary" onClick={onHide}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedFrameworkName || !selectedInputName}
          className="px-4"
        >
          Terapkan Koneksi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputSelectionModal;

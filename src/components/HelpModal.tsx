import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Row, Col } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import {
  FaBook,
  FaQuestionCircle,
  FaList,
  FaGift,
  FaUsers,
  FaFileAlt,
  FaArrowLeft,
} from "react-icons/fa";

interface HelpModalProps {
  show: boolean;
  onHide: () => void;
}

interface Document {
  title: string;
  file: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onHide }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && documents.length === 0) {
      const fetchDocuments = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/PromptMatrixV20/docs-manifest.json");
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data: Document[] = await response.json();
          setDocuments(data);
        } catch (e) {
          console.error("Failed to load documents manifest:", e);
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setIsLoading(false);
        }
      };
      fetchDocuments();
    }
  }, [show, documents.length]);

  const loadMarkdown = async (filePath: string, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(filePath);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      setMarkdownContent(text);
      setDocumentTitle(title);
    } catch (e) {
      console.error("Failed to load markdown file:", e);
      setMarkdownContent(
        `Failed to load content. Error: ${e instanceof Error ? e.message : String(e)}`,
      );
      setDocumentTitle("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHelp = () => {
    setMarkdownContent(null);
    setDocumentTitle(null);
    setError(null);
  };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        handleBackToHelp();
        setDocuments([]);
      }, 300);
    }
  }, [show]);

  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("panduan")) return <FaBook size={24} />;
    if (lowerTitle.includes("faq")) return <FaQuestionCircle size={24} />;
    if (lowerTitle.includes("kerangka")) return <FaList size={24} />;
    if (lowerTitle.includes("rilis")) return <FaGift size={24} />;
    if (lowerTitle.includes("kontribusi")) return <FaUsers size={24} />;
    return <FaFileAlt size={24} />;
  };

  const getButtonClass = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("panduan")) return "btn-vibrant-green";
    if (lowerTitle.includes("faq")) return "btn-electric-purple";
    if (lowerTitle.includes("kerangka")) return "btn-cyber-orange";
    return "btn-cool-blue";
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      scrollable
      dialogClassName="modal-themed"
    >
      <Modal.Header
        closeButton
        className="modal-header-themed border-bottom-0 pb-0"
      >
        <Modal.Title className="d-flex align-items-center gap-3">
          {markdownContent && (
            <Button
              variant="link"
              onClick={handleBackToHelp}
              className="p-0 text-decoration-none text-light"
              aria-label="Kembali"
            >
              <FaArrowLeft size={20} />
            </Button>
          )}
          <span>{documentTitle || "Pusat Bantuan Prompt Matrix"}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-4">
        {isLoading ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <Spinner animation="border" variant="info" role="status" />
            <span className="mt-3 text-muted">Memuat konten...</span>
          </div>
        ) : markdownContent ? (
          <div className="markdown-content-wrapper fade-in">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        ) : (
          <div className="fade-in">
            <Row className="mb-5 justify-content-center text-center">
              <Col md={8}>
                <h4 className="mb-3 text-light">
                  Selamat Datang di Dokumentasi
                </h4>
                <p className="text-muted">
                  Pilih topik di bawah ini untuk mempelajari cara menggunakan
                  Prompt Matrix secara maksimal.
                </p>
              </Col>
            </Row>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <Row className="g-4 justify-content-center">
              {documents.map((doc) => (
                <Col key={doc.file} xs={12} sm={6} md={4} lg={3}>
                  <div
                    className={`help-card h-100 p-4 text-center cursor-pointer hover-lift ${getButtonClass(doc.title)}`}
                    onClick={() =>
                      loadMarkdown(
                        `/PromptMatrixV20/docs/${doc.file}`,
                        doc.title,
                      )
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mb-3 icon-glow">
                      {getIconForTitle(doc.title)}
                    </div>
                    <h6 className="mb-0 fw-bold">{doc.title}</h6>
                  </div>
                </Col>
              ))}
            </Row>

            <hr className="my-5 opacity-25" />

            <Row className="justify-content-center">
              <Col md={10}>
                <h5 className="mb-4 text-info">Alur Kerja Dasar</h5>
                <div className="workflow-steps d-flex flex-column flex-md-row gap-4">
                  <div className="step-item flex-1 p-3 border border-dark rounded bg-dark-subtle">
                    <div className="badge bg-info text-dark mb-2">
                      Langkah 1
                    </div>
                    <h6>Pilih Kategori</h6>
                    <p className="small text-muted mb-0">
                      Jelajahi panel navigasi kiri untuk menemukan kerangka
                      kerja yang sesuai.
                    </p>
                  </div>
                  <div className="step-item flex-1 p-3 border border-dark rounded bg-dark-subtle">
                    <div className="badge bg-primary text-light mb-2">
                      Langkah 2
                    </div>
                    <h6>Isi Parameter</h6>
                    <p className="small text-muted mb-0">
                      Lengkapi formulir input dinamis di panel tengah sesuai
                      kebutuhan.
                    </p>
                  </div>
                  <div className="step-item flex-1 p-3 border border-dark rounded bg-dark-subtle">
                    <div className="badge bg-success text-light mb-2">
                      Langkah 3
                    </div>
                    <h6>Generate & Salin</h6>
                    <p className="small text-muted mb-0">
                      Lihat hasil prompt di panel kanan, lalu salin atau simpan.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed border-top-0 pt-0">
        {!markdownContent && (
          <p className="small text-muted me-auto mb-0">
            Butuh bantuan lebih lanjut? Hubungi{" "}
            <a
              href="mailto:si.sigitadi@gmail.com"
              className="text-info text-decoration-none"
            >
              Support
            </a>
          </p>
        )}
        <Button variant="outline-secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HelpModal;

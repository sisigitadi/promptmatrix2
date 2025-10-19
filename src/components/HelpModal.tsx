import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import {
  FaBook,
  FaQuestionCircle,
  FaList,
  FaGift,
  FaUsers,
  FaFileAlt,
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
      // Only fetch if modal is shown and documents are not loaded yet
      const fetchDocuments = async () => {
        setIsLoading(true);
        try {
          // The base path is needed for GitHub Pages deployment
          const response = await fetch("/PromptMatrixV20/docs-manifest.json");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

  // Reset state when modal is closed
  useEffect(() => {
    if (!show) {
      // Delay reset to avoid flash of content change during closing animation
      setTimeout(() => {
        handleBackToHelp();
        setDocuments([]); // Clear documents to allow refetching next time
      }, 300);
    }
  }, [show]);

  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("panduan")) return <FaBook />;
    if (lowerTitle.includes("faq")) return <FaQuestionCircle />;
    if (lowerTitle.includes("kerangka")) return <FaList />;
    if (lowerTitle.includes("rilis")) return <FaGift />;
    if (lowerTitle.includes("kontribusi")) return <FaUsers />;
    return <FaFileAlt />; // Default icon
  };

  const getButtonClass = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("panduan")) return "btn-vibrant-green";
    if (lowerTitle.includes("faq")) return "btn-electric-purple";
    if (lowerTitle.includes("kerangka")) return "btn-cyber-orange";
    return "btn-cool-blue"; // Default class
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>
          {documentTitle || "Prompt Matrix 2.0 - Bantuan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="modal-body-themed text-start"
        style={{ minHeight: "300px" }}
      >
        {isLoading && !markdownContent ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" />
          </div>
        ) : markdownContent ? (
          <>
            <Button
              variant="outline-info"
              onClick={handleBackToHelp}
              className="mb-3 glow-on-hover"
            >
              Kembali ke Bantuan
            </Button>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            )}
          </>
        ) : (
          <>
            <h5>Selamat Datang di Prompt Matrix 2.0!</h5>
            <p>
              Pilih salah satu dokumen di bawah ini untuk membaca panduan lebih
              lanjut.
            </p>
            {error && (
              <div className="alert alert-danger">
                Gagal memuat daftar dokumen: {error}
              </div>
            )}
            <div className="d-flex flex-wrap justify-content-around gap-3 mb-4">
              {documents.map((doc) => (
                <button
                  key={doc.file}
                  className={`help-doc-icon btn ${getButtonClass(doc.title)}`}
                  onClick={() =>
                    loadMarkdown(`/PromptMatrixV20/docs/${doc.file}`, doc.title)
                  }
                  aria-label={`Baca ${doc.title}`}
                >
                  {getIconForTitle(doc.title)}
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>
            <hr />
            <h6>Alur Kerja Dasar:</h6>
            <ol>
              <li>
                <strong>Pilih Kategori & Kerangka Kerja:</strong> Jelajahi panel
                navigasi kiri.
              </li>
              <li>
                <strong>Isi Formulir:</strong> Lengkapi input di panel tengah.
              </li>
              <li>
                <strong>Pratinjau & Salin:</strong> Lihat hasilnya di panel
                kanan.
              </li>
            </ol>
            <p className="mt-3">
              Untuk informasi lebih lanjut, silakan email ke{" "}
              <strong>
                <a href="mailto:si.sigitadi@gmail.com">si.sigitadi@gmail.com</a>
              </strong>
              .
            </p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HelpModal;

import React from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  FaCopy,
  FaRobot,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTypewriter } from "../hooks/useTypewriter";

interface AiResponseModalProps {
  show: boolean;
  onHide: () => void;
  aiResponse: string | null;
  aiError: string | null;
  isGenerating: boolean;
}

// Custom component to handle typewriter effect for individual text blocks (if needed later)
// const TypewriterText = ({ text }: { text: string }) => {
//   const displayedText = useTypewriter(text, 5);
//   return <p className="mb-3 typewriter-text">{displayedText}</p>;
// };

const AiResponseModal: React.FC<AiResponseModalProps> = ({
  show,
  onHide,
  aiResponse,
  aiError,
  isGenerating,
}) => {
  // We stream the entire Markdown content to simulate accurate real-time generation
  const streamingResponse = useTypewriter(aiResponse || "", 5);

  const handleCopy = () => {
    if (!aiResponse) return;
    const textToCopy = aiResponse.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    navigator.clipboard.writeText(textToCopy);
    toast.info("Respons AI disalin!");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      scrollable
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed border-bottom-0">
        <Modal.Title className="d-flex align-items-center gap-2 text-info">
          <FaRobot /> Respons AI
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-0">
        <div className="p-4">
          {isGenerating ? (
            <div className="text-center py-5">
              <Spinner animation="grow" variant="info" className="mb-3" />
              <h5 className="text-info">AI Sedang Berpikir...</h5>
              <p className="text-muted small">
                Harap tunggu sebentar, kami sedang menyusun prompt Anda.
              </p>
            </div>
          ) : aiError ? (
            <Alert
              variant="danger"
              className="d-flex align-items-start gap-3 bg-dark border-danger text-danger"
            >
              <FaExclamationTriangle size={24} className="mt-1" />
              <div>
                <h6 className="fw-bold">Terjadi Kesalahan</h6>
                <p className="mb-0 small">{aiError}</p>
              </div>
            </Alert>
          ) : aiResponse ? (
            <div className="ai-response-wrapper border border-secondary rounded overflow-hidden">
              <div className="p-3 bg-dark-subtle border-bottom border-secondary d-flex justify-content-between align-items-center">
                <span className="small text-muted text-uppercase fw-bold letter-spacing-1">
                  Markdown Output
                </span>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={handleCopy}
                  className="py-1"
                >
                  <FaCopy className="me-1" /> Salin
                </Button>
              </div>
              <div
                className="p-4 bg-dark custom-scrollbar"
                style={{ maxHeight: "65vh", overflowY: "auto" }}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          PreTag="div"
                          style={{} as any}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className={`${className} bg-secondary px-1 rounded text-info`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-start border-4 border-info ps-3 my-3 text-muted fst-italic">
                          {children}
                        </blockquote>
                      );
                    },
                    p({ children }) {
                      // Only apply typewriter to plain strings to avoid double typing
                      if (typeof children === "string") {
                        return (
                          <p className="mb-3 typewriter-text">{children}</p>
                        );
                      }
                      return <p className="mb-3">{children}</p>;
                    },
                    img({ ...props }) {
                      return (
                        <div className="text-center my-4">
                          <img
                            {...props}
                            className="img-fluid rounded border border-secondary shadow-lg"
                            alt={props.alt || "AI Content"}
                          />
                          {!props.src?.startsWith("data:") && (
                            <a
                              className="btn btn-link btn-sm text-info mt-2"
                              href={props.src}
                              download
                            >
                              <FaDownload className="me-1" /> Unduh Gambar
                            </a>
                          )}
                        </div>
                      );
                    },
                  }}
                >
                  {streamingResponse}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted opacity-50">
              <FaRobot size={48} className="mb-3" />
              <p>Belum ada respons untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="modal-footer-themed bg-dark border-top border-secondary">
        <Button variant="outline-secondary" onClick={onHide} className="px-4">
          Tutup
        </Button>
        {aiResponse && !isGenerating && (
          <Button variant="primary" onClick={handleCopy} className="px-4">
            <FaCopy className="me-2" /> Salin Hasil Lengkap
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AiResponseModal;

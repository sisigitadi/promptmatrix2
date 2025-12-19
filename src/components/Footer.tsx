import React from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaCode, FaHeart } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

interface FooterProps {
  showDevMode: boolean;
  isApiKeyEnabled: boolean;
  onShowFeedback: () => void;
  onNavigate: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({
  showDevMode,
  isApiKeyEnabled,
  onShowFeedback,
  onNavigate,
}) => {
  const currentYear = new Date().getFullYear();
  const REPO_URL = "https://github.com/sisigitadi/promptmatrix2";

  return (
    <footer className="app-footer">
      <Container fluid="lg">
        <Row className="gy-4 justify-content-between align-items-start">
          {/* Kolom Kiri: Brand & Info Utama */}
          <Col lg={5} md={6} xs={12} className="text-start">
            <div className="d-flex align-items-center mb-1">
              <h1
                className="h4 mb-0 footer-brand-title cursor-pointer"
                onClick={() => onNavigate("generator")}
                role="button"
              >
                PromptMatrix 2.0
              </h1>
            </div>
            <p className="copyright-text mb-2 d-flex align-items-center small">
              Dibuat dengan{" "}
              <FaHeart className="mx-1 heart-beat" color="#ff00ff" /> dan AI
            </p>
            <p className="footer-description small opacity-75 mb-3">
              Platform rekayasa prompt AI profesional untuk produktivitas
              maksimal.
            </p>
            <div className="d-flex gap-3 social-links mb-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/sigitadi/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="mailto:si.sigitadi@gmail.com"
                className="social-icon"
                aria-label="Email"
              >
                <MdEmail size={18} />
              </a>
            </div>
            <Button
              variant="outline-info"
              size="sm"
              className="footer-nav-btn-slim"
              onClick={onShowFeedback}
            >
              Umpan Balik
            </Button>
          </Col>

          {/* Kolom Kanan: Status (Rata Kanan di Desktop) */}
          <Col lg={6} md={6} xs={12} className="text-md-end text-start">
            {showDevMode && (
              <div className="d-flex flex-column align-items-md-end align-items-start gap-2 mt-3 mt-md-0">
                <Badge bg="danger" className="dev-mode-badge-tiny px-3 py-2">
                  Dev Mode Activated
                </Badge>
                {isApiKeyEnabled && (
                  <div className="api-status-pill online px-3 py-2">
                    <FaCode size={12} className="me-2" />
                    API: Connected
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        <div className="footer-divider-slim" />

        <Row className="align-items-center">
          <Col xs={12} className="text-start">
            <span className="copyright-text-tiny">
              &copy; {currentYear} Sigit Adi.
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

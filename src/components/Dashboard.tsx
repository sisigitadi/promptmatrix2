import React from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { FaThLarge, FaHistory, FaPlusCircle } from "react-icons/fa";

// This is a placeholder type. We will need to pass the actual saved prompts data later.
import { SavedPrompt } from "@/types";

interface DashboardProps {
  savedPrompts: SavedPrompt[];
  onNavigate: (view: string) => void;
  onLoadPrompt: (versionData: any, parentPrompt: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  savedPrompts,
  onNavigate,
  onLoadPrompt,
}) => {
  const recentPrompts = [...savedPrompts]
    .sort((a, b) => {
      const lastVersionA = a.versions?.[a.versions?.length - 1]?.timestamp ?? 0;
      const lastVersionB = b.versions?.[b.versions?.length - 1]?.timestamp ?? 0;
      return lastVersionB - lastVersionA;
    })
    .slice(0, 5);

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Card className="p-4 shadow-sm">
            <h1 className="h3 fw-bold" style={{ color: "var(--neon-cyan)" }}>
              Selamat Datang Kembali!
            </h1>
            <p className="text-muted mb-4">
              Pusat kendali profesional Anda untuk arsitektur prompt tingkat
              lanjut.
            </p>
            <Button
              variant="info"
              onClick={() => onNavigate("generator")}
              className="fw-bold text-white shadow-sm"
              style={{ padding: "0.75rem 1.5rem" }}
            >
              <FaPlusCircle className="me-2" />
              Buat Prompt Baru
            </Button>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Prompts Column */}
        <Col md={8}>
          <h2 className="h5 mb-3">
            <FaHistory className="me-2" />
            Aktivitas Terakhir
          </h2>
          <Card>
            <Card.Body>
              {recentPrompts.length > 0 ? (
                <ListGroup variant="flush">
                  {recentPrompts.map((prompt) => {
                    const lastTimestamp =
                      prompt.versions?.[prompt.versions?.length - 1]
                        ?.timestamp ?? 0;
                    const formattedDateTime = new Date(
                      lastTimestamp,
                    ).toLocaleString();
                    console.log(
                      `Prompt ID: ${prompt.id}, Timestamp: ${lastTimestamp}, Formatted: ${formattedDateTime}`,
                    );
                    return (
                      <ListGroup.Item
                        key={prompt.id}
                        className="d-flex justify-content-between align-items-center p-3 border-bottom-0 mb-2 rounded card"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="flex-grow-1 me-3">
                          <p className="fw-bold mb-1">{prompt.frameworkName}</p>
                          <p className="small text-muted mb-0">
                            Terakhir diubah: {formattedDateTime}
                          </p>
                        </div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            onLoadPrompt(
                              prompt.versions?.[prompt.versions?.length - 1] ??
                                {},
                              prompt,
                            )
                          }
                        >
                          Muat
                        </Button>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <p className="text-center text-muted p-3">
                  Belum ada prompt yang disimpan.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Stats Column */}
        <Col md={4}>
          <h2 className="h5 mb-3">
            <FaThLarge className="me-2" />
            Statistik
          </h2>
          <Card className="text-center">
            <Card.Body>
              <p className="text-muted mb-1 text-uppercase small letter-spacing-1">
                Total Prompt Disimpan
              </p>
              <h3
                className="display-4 fw-bold"
                style={{ color: "var(--neon-cyan)" }}
              >
                {savedPrompts.length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

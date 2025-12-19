import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

interface FeedbackModalProps {
  show: boolean;
  onHide: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ show, onHide }) => {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = {
      rating,
      selectedFeatures,
      feedbackText,
    };
    console.log("Feedback Submitted:", feedbackData);
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  const handleClose = () => {
    setSubmitted(false);
    setRating(null);
    setSelectedFeatures([]);
    setFeedbackText("");
    onHide();
  };

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Beri Kami Umpan Balik</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-themed p-4">
        {submitted ? (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: "3rem" }}>
              🎉
            </div>
            <h4 className="text-success mb-3">Terima Kasih!</h4>
            <p className="text-muted">
              Masukan Anda sangat berharga untuk pengembangan Prompt Matrix
              selanjutnya.
            </p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col>
                <Form.Label className="h6 mb-3 text-light">
                  Seberapa puaskah Anda dengan aplikasi ini?
                </Form.Label>
                <div className="d-flex justify-content-between px-3 py-3 bg-dark-subtle rounded border border-secondary">
                  {["🙁", "😠", "😐", "🙂", "😄"].map((emoji, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      name="rating"
                      id={`rating-${index}`}
                      label={
                        <span style={{ fontSize: "2rem", cursor: "pointer" }}>
                          {emoji}
                        </span>
                      }
                      value={emoji}
                      checked={rating === emoji}
                      onChange={(e) => setRating(e.target.value)}
                      className="d-flex flex-column align-items-center gap-2"
                    />
                  ))}
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Form.Label className="h6 mb-3 text-light">
                  Fitur apa yang Anda harapkan?
                </Form.Label>
                <div className="d-flex flex-column gap-3">
                  {[
                    "Kolaborasi Tim & Berbagi Prompt",
                    "Integrasi API (Zapier, dll.)",
                    "Analitik Performa Prompt",
                    "Mode Gelap Otomatis (System Theme)",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="form-check-custom p-3 border border-secondary rounded hover-bg-dark"
                    >
                      <Form.Check
                        type="checkbox"
                        label={feature}
                        id={`feature-${feature}`}
                        value={feature}
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="mb-0"
                      />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="feedbackText">
              <Form.Label className="h6 mb-2 text-light">
                Masukan Tambahan
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Ceritakan pengalaman Anda atau bagikan ide..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleClose}>
                Batal
              </Button>
              <Button variant="primary" type="submit" disabled={!rating}>
                Kirim Umpan Balik
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackModal;

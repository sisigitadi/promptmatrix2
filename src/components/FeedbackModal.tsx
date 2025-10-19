import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

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
    // In a real application, you would handle the form data here (e.g., send to an API).
    const feedbackData = {
      rating,
      selectedFeatures,
      feedbackText,
    };
    console.log("Feedback Submitted:", feedbackData);
    // Simulate API call success
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2000); // Close modal after 2 seconds
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
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Beri Kami Umpan Balik</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed">
        {submitted ? (
          <Alert variant="success">
            Terima kasih! Umpan balik Anda sangat berharga bagi kami.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="feedbackRating">
              <Form.Label>
                Seberapa puaskah Anda dengan PromptMatrix 2.0?
              </Form.Label>
              <div className="d-flex justify-content-around">
                {"🙁 😠 😐 🙂 😄".split(" ").map((emoji, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    name="rating"
                    id={`rating-${index}`}
                    label={emoji}
                    style={{ fontSize: "1.5rem" }}
                    value={emoji}
                    checked={rating === emoji}
                    onChange={(e) => setRating(e.target.value)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="feedbackFeature">
              <Form.Label>
                Fitur apa yang paling Anda inginkan selanjutnya?
              </Form.Label>
              <Form.Check
                type="checkbox"
                label="Kolaborasi Tim & Berbagi Prompt"
                id="feature-collab"
                value="Kolaborasi Tim & Berbagi Prompt"
                checked={selectedFeatures.includes(
                  "Kolaborasi Tim & Berbagi Prompt",
                )}
                onChange={() =>
                  handleFeatureChange("Kolaborasi Tim & Berbagi Prompt")
                }
              />
              <Form.Check
                type="checkbox"
                label="Integrasi dengan API Eksternal (Zapier, dll.)"
                id="feature-api"
                value="Integrasi dengan API Eksternal (Zapier, dll.)"
                checked={selectedFeatures.includes(
                  "Integrasi dengan API Eksternal (Zapier, dll.)",
                )}
                onChange={() =>
                  handleFeatureChange(
                    "Integrasi dengan API Eksternal (Zapier, dll.)",
                  )
                }
              />
              <Form.Check
                type="checkbox"
                label="Analitik & Performa Prompt"
                id="feature-analytics"
                value="Analitik & Performa Prompt"
                checked={selectedFeatures.includes(
                  "Analitik & Performa Prompt",
                )}
                onChange={() =>
                  handleFeatureChange("Analitik & Performa Prompt")
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="feedbackText">
              <Form.Label>Apakah ada masukan lain?</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Saran, kritik, atau ide Anda..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Kirim Umpan Balik
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackModal;

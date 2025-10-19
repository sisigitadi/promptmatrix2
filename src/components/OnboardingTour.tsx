import React from "react";
import { Button, Modal } from "react-bootstrap";

interface OnboardingTourProps {
  show: boolean;
  onHide: () => void;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  show,
  onHide,
  onComplete,
}) => {
  // This is a placeholder for a more complex interactive tour
  // In a real implementation, you would integrate a library like react-joyride here
  // or build a custom step-by-step guide.

  const handleStartTour = () => {
    // Logic to start the actual tour (e.g., initialize react-joyride)
    // For now, we'll just complete it.
    onComplete();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Selamat Datang di PromptMatrix 2.0!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Jelajahi kekuatan PromptMatrix 2.0 dengan tur singkat ini.</p>
        <p>
          Kami akan memandu Anda melalui fitur-fitur utama untuk membantu Anda
          mengoptimalkan prompt AI Anda.
        </p>
        <p>
          Klik &quot;Mulai Tur&quot; untuk memulai, atau &quot;Lewati&quot; jika
          Anda sudah familiar.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Lewati
        </Button>
        <Button variant="primary" onClick={handleStartTour}>
          Mulai Tur
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OnboardingTour;

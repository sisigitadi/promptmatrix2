import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";

const COOKIE_CONSENT_KEY = "cookie_consent_given";

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(() => {
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    return !consentGiven;
  });

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Card
      className="position-fixed bottom-0 start-0 m-3 p-3 shadow-lg"
      style={{ zIndex: 1050, maxWidth: "350px" }}
    >
      <Card.Body>
        <Card.Title>Penggunaan Cookie</Card.Title>
        <Card.Text className="small">
          Situs ini menggunakan cookie untuk memastikan Anda mendapatkan
          pengalaman terbaik. Dengan melanjutkan, Anda menyetujui penggunaan
          cookie kami.
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="ms-1"
          >
            Pelajari lebih lanjut.
          </a>
        </Card.Text>
        <Button variant="primary" size="sm" onClick={handleAccept}>
          Setuju
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CookieConsent;

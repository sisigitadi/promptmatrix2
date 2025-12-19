import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Joyride, { CallBackProps, STATUS, ACTIONS, EVENTS } from "react-joyride";

interface OnboardingTourProps {
  show: boolean;
  onHide: () => void;
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    target: "#navigation-pane",
    content: (
      <div>
        <h4>1. Panel Navigasi</h4>
        <p>
          Di sini Anda dapat memilih kategori, sub-kategori, dan kerangka kerja
          prompt yang berbeda. Gunakan bilah pencarian dan filter untuk
          menemukan yang Anda butuhkan.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "#framework-pane",
    content: (
      <div>
        <h4>2. Komponen Kerangka Kerja</h4>
        <p>
          Setelah Anda memilih kerangka kerja, formulir ini akan diisi dengan
          bidang input spesifik yang perlu Anda isi.
        </p>
        <p>
          Gunakan Mode Wizard untuk panduan langkah demi langkah, atau mode
          bebas untuk mengisi semua bidang sekaligus.
        </p>
      </div>
    ),
    placement: "left",
  },
  {
    target: "#output-display",
    content: (
      <div>
        <h4>3. Pratinjau &amp; Output Prompt</h4>
        <p>
          Prompt Anda yang dibuat akan muncul di sini. Anda dapat menyalinnya,
          mengeditnya, atau menggunakan fitur &apos;AI Assist&apos; dalam Mode
          Pengembang.
        </p>
      </div>
    ),
    placement: "left",
  },
  {
    target: "#dev-mode-switch",
    content: (
      <div>
        <h4>4. Mode Pengembang</h4>
        <p>
          Aktifkan sakelar ini untuk mengaktifkan fitur tambahan seperti
          &apos;AI Assist&apos; dan kemampuan untuk menguji prompt Anda secara
          langsung dengan model AI.
        </p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: "#saved-prompts-button",
    content: (
      <div>
        <h4>5. Prompt Tersimpan</h4>
        <p>
          Akses prompt yang Anda simpan di sini. Anda juga dapat melihat prompt
          yang terakhir digunakan untuk referensi cepat.
        </p>
      </div>
    ),
    placement: "top",
  },
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  show,

  onHide,

  onComplete,
}) => {
  const [run, setRun] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);

  // No useEffect here for starting the tour based on 'show'.

  // Tour initiation is now explicit via 'handleStartTour'.

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, status, index, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);

      onComplete();

      onHide();
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    // Handle other actions like 'close' or 'error' if needed
  };

  const handleStartTour = () => {
    setRun(true);

    setStepIndex(0);

    // onHide is not called here, as Joyride manages its own visibility

    // and the original modal will be hidden by Joyride's overlay.
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onComplete();
          onHide();
        }}
        centered
      >
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
            Klik &quot;Mulai Tur&quot; untuk memulai, atau &quot;Lewati&quot;
            jika Anda sudah familiar.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onComplete();
              onHide();
            }}
          >
            Lewati
          </Button>

          <Button variant="primary" onClick={handleStartTour}>
            Mulai Tur
          </Button>
        </Modal.Footer>
      </Modal>

      <Joyride
        run={run}
        steps={TOUR_STEPS}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        locale={{
          last: "Selesai",

          skip: "Lewati",

          back: "Kembali",

          next: "Lanjut",
        }}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,

            primaryColor: "var(--primary-color)", // Use a theme variable
          },

          buttonClose: {
            display: "none", // Hide default close button, handled by callback
          },
        }}
      />
    </>
  );
};

export default OnboardingTour;

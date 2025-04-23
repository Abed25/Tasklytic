// src/components/PWAUpdater.jsx
import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";
import { toast } from "react-toastify";

const updateSW = registerSW({
  onNeedRefresh() {
    toast.info(
      <div>
        🔄 A new version is available.
        <br />
        <button
          onClick={() => updateSW(true)}
          style={{
            marginTop: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Refresh Now
        </button>
      </div>,
      {
        position: "top-center",
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  },
  onOfflineReady() {
    console.log("✅ App ready for offline use");
  },
});

export default function PWAUpdater() {
  useEffect(() => {
    // triggers service worker check
  }, []);

  return null;
}

import React from "react";

const Modal = ({ isOpen, onClose, title, children, style={} }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          ...style,
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          padding: "24px 32px",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#9c8c6a", // gold-ish color like in your screenshot
            fontWeight: "bold",
          }}
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: "0 0 24px 0",
            }}
          >
            {title}
          </h2>
        )}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

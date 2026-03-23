import React, { useRef, useState, useEffect } from "react";

interface Props {
  onClose: () => void;
}

export function Win2kWelcomeDialog({ onClose }: Props) {
  const [pos, setPos] = useState(() => {
    const w = 420;
    const h = 220;
    return {
      x: Math.round((window.innerWidth - w) / 2),
      y: Math.round((window.innerHeight - h) / 2),
    };
  });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({
        x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 420)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 220)),
      });
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  if (!pos) return null;

  return (
    <>
      {/* Backdrop — slightly darkens desktop like a real modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "transparent",
        }}
      />

      {/* Dialog box */}
      <div
        ref={dialogRef}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: 420,
          zIndex: 501,
          userSelect: "none",
          fontFamily: "Tahoma, sans-serif",
          fontSize: "11px",
          // Classic Win2k raised-window border
          border: "2px solid #808080",
          boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #404040, 3px 3px 6px rgba(0,0,0,0.35)",
        }}
      >
        {/* ── Title Bar ── */}
        <div
          onMouseDown={handleTitleBarMouseDown}
          style={{
            height: 26,
            background: "linear-gradient(to right, #0A246A, #A6CAF0)",
            display: "flex",
            alignItems: "center",
            padding: "0 3px 0 5px",
            gap: 5,
            cursor: "default",
          }}
        >
          {/* Windows flag icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
            <rect x="0" y="0" width="6" height="6" fill="#FF0000" />
            <rect x="8" y="0" width="6" height="6" fill="#00AA00" />
            <rect x="0" y="8" width="6" height="6" fill="#0000FF" />
            <rect x="8" y="8" width="6" height="6" fill="#FFCC00" />
          </svg>

          <span style={{ color: "white", fontSize: "11px", fontWeight: "bold", flex: 1, textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>
            Welcome
          </span>

          {/* Close button */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            style={{
              width: 17,
              height: 15,
              backgroundColor: "#D4D0C8",
              border: "none",
              boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
              cursor: "default",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            backgroundColor: "#D4D0C8",
            padding: "20px 20px 16px",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          {/* Info icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="16" cy="16" r="15" fill="#1A6FBF" stroke="#0A3F80" strokeWidth="1" />
            <circle cx="16" cy="9" r="2.2" fill="white" />
            <rect x="13.5" y="13" width="5" height="12" rx="1" fill="white" />
          </svg>

          {/* Message */}
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontFamily: "Tahoma, sans-serif",
              lineHeight: "1.6",
              color: "#000",
            }}
          >
            Welcome to Matthew's Portfolio. Here you can view Matthew's resume, Matthew's recent
            projects, as well as other information.
          </p>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, backgroundColor: "#ACA899", margin: "0 0" }} />

        {/* ── Button Row ── */}
        <div
          style={{
            backgroundColor: "#D4D0C8",
            padding: "10px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onClose}
            autoFocus
            style={{
              width: 75,
              height: 23,
              backgroundColor: "#D4D0C8",
              fontFamily: "Tahoma, sans-serif",
              fontSize: "11px",
              cursor: "default",
              border: "none",
              boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
              // Focus ring — classic Win2k dotted outline inside button
              outline: "1px dotted #000",
              outlineOffset: "-4px",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}

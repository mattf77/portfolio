import React, { useRef, useState, useEffect } from "react";

interface Props {
  onClose: () => void;
  onRun: (command: string) => void;
}

export function Win2kRunDialog({ onClose, onRun }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [value, setValue] = useState("");
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const w = 400;
    const h = 172;
    setPos({
      x: Math.round((window.innerWidth - w) / 2),
      y: Math.round((window.innerHeight - h) / 2),
    });
  }, []);

  useEffect(() => {
    if (pos) inputRef.current?.focus();
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !pos) return;
      setPos({
        x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - 400)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - 172)),
      });
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [pos]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleOK = () => {
    const cmd = value.trim().toLowerCase();
    if (cmd) {
      onRun(cmd);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleOK();
    if (e.key === "Escape") onClose();
  };

  if (!pos) return null;

  const btnStyle: React.CSSProperties = {
    width: 75,
    height: 23,
    backgroundColor: "#D4D0C8",
    fontFamily: "Tahoma, sans-serif",
    fontSize: "11px",
    cursor: "default",
    border: "none",
    boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 600 }} />
      <div
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          width: 400,
          zIndex: 601,
          userSelect: "none",
          fontFamily: "Tahoma, sans-serif",
          fontSize: "11px",
          border: "2px solid #808080",
          boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #404040, 3px 3px 6px rgba(0,0,0,0.35)",
        }}
      >
        {/* Title Bar */}
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
          {/* Run icon — little running figure */}
          <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
            <rect x="1" y="4" width="10" height="8" rx="1" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.8" />
            <rect x="5" y="7" width="10" height="5" rx="1" fill="#D4D0C8" stroke="#808080" strokeWidth="0.8" />
            <rect x="7" y="9" width="3" height="1.5" rx="0.3" fill="#808080" />
          </svg>
          <span style={{ color: "white", fontSize: "11px", fontWeight: "bold", flex: 1, textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>
            Run
          </span>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            style={{
              width: 17, height: 15,
              backgroundColor: "#D4D0C8",
              border: "none",
              boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
              cursor: "default",
              padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "9px", fontWeight: "bold", color: "#000",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: "#D4D0C8", padding: "16px 16px 12px" }}>
          {/* Top row: icon + description */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
            {/* Large run icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
              <rect x="2" y="8" width="20" height="16" rx="1" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="1" />
              <rect x="2" y="8" width="20" height="4" rx="1" fill="#1565C0" />
              <line x1="5" y1="16" x2="19" y2="16" stroke="#ccc" strokeWidth="1" />
              <line x1="5" y1="19" x2="15" y2="19" stroke="#ccc" strokeWidth="1" />
              <rect x="12" y="16" width="18" height="12" rx="1" fill="#D4D0C8" stroke="#808080" strokeWidth="1" />
              <rect x="15" y="19" width="6" height="3" rx="0.5" fill="#808080" />
            </svg>
            <p style={{ margin: 0, fontSize: "11px", fontFamily: "Tahoma, sans-serif", lineHeight: "1.5", color: "#000" }}>
              Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
            </p>
          </div>

          {/* Open: label + input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <label style={{ fontSize: "11px", whiteSpace: "nowrap" }}>Open:</label>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                height: 21,
                border: "2px inset #808080",
                fontFamily: "Tahoma, sans-serif",
                fontSize: "11px",
                padding: "0 3px",
                backgroundColor: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: "#ACA899", marginBottom: 10 }} />

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button style={{ ...btnStyle, outline: "1px dotted #000", outlineOffset: "-4px" }} onClick={handleOK}>
              OK
            </button>
            <button style={btnStyle} onClick={onClose}>
              Cancel
            </button>
            <button style={{ ...btnStyle, color: "#808080" }} disabled>
              Browse...
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

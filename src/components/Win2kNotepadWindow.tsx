import React, { useState, useRef, useEffect } from "react";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  minimized: boolean;
  zIndex: number;
  initialPos?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

const TASKBAR_H = 36;
const MIN_W = 300;
const MIN_H = 200;

const titleBarBtnStyle: React.CSSProperties = {
  width: 17,
  height: 15,
  backgroundColor: "#D4D0C8",
  border: "none",
  boxShadow:
    "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
  cursor: "default",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "9px",
  fontFamily: "Tahoma, sans-serif",
  fontWeight: "bold",
  color: "#000",
  lineHeight: 1,
  flexShrink: 0,
};

export function Win2kNotepadWindow({
  onClose,
  onMinimize,
  onFocus,
  minimized,
  zIndex,
  initialPos = { x: 180, y: 70 },
  initialSize = { width: 520, height: 380 },
}: Props) {
  const [pos, setPos] = useState(initialPos);
  const [size, setSize] = useState(initialSize);
  const [maximized, setMaximized] = useState(false);
  const preMaximize = useRef({ pos: initialPos, size: initialSize });

  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const posRef = useRef(pos);
  const sizeRef = useRef(size);

  const updatePos = (p: { x: number; y: number }) => { posRef.current = p; setPos(p); };
  const updateSize = (s: { width: number; height: number }) => { sizeRef.current = s; setSize(s); };

  const handleMaximize = () => {
    if (maximized) {
      updatePos(preMaximize.current.pos);
      updateSize(preMaximize.current.size);
      setMaximized(false);
    } else {
      preMaximize.current = { pos, size };
      updatePos({ x: 0, y: 0 });
      updateSize({ width: window.innerWidth, height: window.innerHeight - TASKBAR_H });
      setMaximized(true);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        updatePos({
          x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - sizeRef.current.width)),
          y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - TASKBAR_H - sizeRef.current.height)),
        });
      }
      if (isResizing.current) {
        updateSize({
          width: Math.min(Math.max(MIN_W, resizeStart.current.w + e.clientX - resizeStart.current.x), window.innerWidth - posRef.current.x),
          height: Math.min(Math.max(MIN_H, resizeStart.current.h + e.clientY - resizeStart.current.y), window.innerHeight - TASKBAR_H - posRef.current.y),
        });
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
  };

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: minimized ? "auto" : size.height,
        display: minimized ? "none" : "flex",
        flexDirection: "column",
        border: "2px solid #808080",
        boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #404040, 3px 3px 8px rgba(0,0,0,0.4)",
        zIndex,
        userSelect: "none",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
        minWidth: MIN_W,
        minHeight: MIN_H,
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
          padding: "0 3px 0 4px",
          gap: 4,
          cursor: "default",
          flexShrink: 0,
        }}
      >
        {/* Notepad icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
          <rect x="2" y="0" width="12" height="15" rx="1" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.8" />
          <rect x="2" y="0" width="12" height="3" rx="1" fill="#1565C0" />
          <line x1="4" y1="6"  x2="12" y2="6"  stroke="#9E9E9E" strokeWidth="1" />
          <line x1="4" y1="8"  x2="12" y2="8"  stroke="#9E9E9E" strokeWidth="1" />
          <line x1="4" y1="10" x2="12" y2="10" stroke="#9E9E9E" strokeWidth="1" />
          <line x1="4" y1="12" x2="9"  y2="12" stroke="#9E9E9E" strokeWidth="1" />
        </svg>

        <span
          style={{
            color: "white",
            fontSize: "11px",
            fontWeight: "bold",
            flex: 1,
            textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          AboutMe.txt - Notepad
        </span>

        {/* Window controls */}
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={titleBarBtnStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
          >
            <span style={{ display: "block", width: 8, height: 2, backgroundColor: "#000", marginTop: 6 }} />
          </button>
          <button
            style={titleBarBtnStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleMaximize}
          >
            {maximized ? (
              <span style={{ position: "relative", display: "inline-block", width: 10, height: 10 }}>
                <span style={{ position: "absolute", top: 2, left: 2, width: 7, height: 7, border: "1px solid #000", background: "#D4D0C8", display: "block" }} />
                <span style={{ position: "absolute", top: 0, left: 0, width: 7, height: 7, border: "1px solid #000", borderTop: "2px solid #000", background: "#D4D0C8", display: "block" }} />
              </span>
            ) : (
              <span style={{ display: "block", width: 8, height: 8, border: "1px solid #000", borderTop: "2px solid #000" }} />
            )}
          </button>
          <button
            style={{ ...titleBarBtnStyle, marginLeft: 2 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Menu Bar ── */}
      <div
        style={{
          height: 20,
          backgroundColor: "#D4D0C8",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          borderBottom: "1px solid #ACA899",
          flexShrink: 0,
        }}
      >
        {["File", "Edit", "Search", "Help"].map((item) => (
          <span
            key={item}
            style={{ padding: "1px 6px", cursor: "default", fontSize: "11px" }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* ── Text Area ── */}
      <textarea
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          padding: "2px 4px",
          fontFamily: "Lucida Console, Courier New, monospace",
          fontSize: "12px",
          lineHeight: "1.4",
          color: "#000",
          backgroundColor: "#fff",
          overflowY: "auto",
          userSelect: "text",
          cursor: "text",
        }}
        defaultValue=""
        spellCheck={false}
        onMouseDown={(e) => e.stopPropagation()}
      />

      {/* ── Resize handle ── */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 14,
          height: 14,
          cursor: "nwse-resize",
          backgroundImage: "radial-gradient(circle, #808080 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "2px 2px",
        }}
      />
    </div>
  );
}

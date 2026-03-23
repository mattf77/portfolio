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

function ToolbarSep() {
  return (
    <div
      style={{
        width: 1,
        height: 18,
        backgroundColor: "#ACA899",
        margin: "0 3px",
        flexShrink: 0,
      }}
    />
  );
}

function TBtn({
  children,
  title,
  bold,
  italic,
  underline,
}: {
  children: React.ReactNode;
  title?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}) {
  return (
    <button
      title={title}
      style={{
        width: 22,
        height: 22,
        backgroundColor: "transparent",
        border: "1px solid transparent",
        cursor: "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontFamily: "Tahoma, sans-serif",
        fontWeight: bold ? "bold" : "normal",
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : "none",
        padding: 0,
        flexShrink: 0,
        color: "#000",
      }}
    >
      {children}
    </button>
  );
}

function DropdownBox({
  value,
  width,
}: {
  value: string;
  width: number;
}) {
  return (
    <div
      style={{
        width,
        height: 20,
        backgroundColor: "white",
        border: "1px solid #7B9EBD",
        display: "flex",
        alignItems: "center",
        padding: "0 2px",
        fontSize: "11px",
        fontFamily: "Tahoma, sans-serif",
        flexShrink: 0,
        gap: 2,
        overflow: "hidden",
      }}
    >
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </span>
      <span style={{ fontSize: "8px", color: "#555" }}>▼</span>
    </div>
  );
}

export function Win2kWordWindow({
  onClose,
  onMinimize,
  onFocus,
  minimized,
  zIndex,
  initialPos = { x: 160, y: 50 },
  initialSize = { width: 680, height: 500 },
}: Props) {
  const [pos, setPos] = useState(initialPos);
  const [size, setSize] = useState(initialSize);
  const [maximized, setMaximized] = useState(false);
  const preMaximize = useRef({ pos: initialPos, size: initialSize });

  const TASKBAR_H = 36;

  const handleMaximize = () => {
    if (maximized) {
      setPos(preMaximize.current.pos);
      setSize(preMaximize.current.size);
      setMaximized(false);
    } else {
      preMaximize.current = { pos, size };
      setPos({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - TASKBAR_H });
      setMaximized(true);
    }
  };

  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPos({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
      if (isResizing.current) {
        setSize({
          width: Math.max(400, resizeStart.current.w + e.clientX - resizeStart.current.x),
          height: Math.max(280, resizeStart.current.h + e.clientY - resizeStart.current.y),
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
        boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #404040, 3px 3px 8px rgba(0,0,0,0.4)",
        border: "2px solid #808080",
        zIndex,
        userSelect: "none",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
        minWidth: 400,
        minHeight: 280,
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
        {/* Word W icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
          <rect width="16" height="16" rx="2" fill="#1A4F9C" />
          <text x="2" y="13" fontSize="12" fontWeight="bold" fill="white" fontFamily="serif">W</text>
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
          Resume - Microsoft Word
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
        {["File", "Edit", "View", "Insert", "Format", "Tools", "Table", "Window", "Help"].map(
          (item) => (
            <span
              key={item}
              style={{ padding: "1px 6px", cursor: "default", fontSize: "11px" }}
            >
              {item}
            </span>
          )
        )}
      </div>

      {/* ── Standard Toolbar ── */}
      <div
        style={{
          height: 28,
          backgroundColor: "#D4D0C8",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          borderBottom: "1px solid #ACA899",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <TBtn title="New">📄</TBtn>
        <TBtn title="Open">📂</TBtn>
        <TBtn title="Save">💾</TBtn>
        <ToolbarSep />
        <TBtn title="Print">🖨</TBtn>
        <TBtn title="Print Preview">🔍</TBtn>
        <ToolbarSep />
        <TBtn title="Spelling & Grammar">
          <span style={{ fontSize: "9px", fontWeight: "bold", textDecoration: "underline wavy red" }}>ABC</span>
        </TBtn>
        <ToolbarSep />
        <TBtn title="Cut">✂</TBtn>
        <TBtn title="Copy">📋</TBtn>
        <TBtn title="Paste">📌</TBtn>
        <TBtn title="Format Painter">
          <span style={{ fontSize: "12px" }}>🖌</span>
        </TBtn>
        <ToolbarSep />
        <TBtn title="Undo">↩</TBtn>
        <TBtn title="Redo">↪</TBtn>
        <ToolbarSep />
        <TBtn title="Insert Table">
          <span style={{ fontSize: "10px" }}>⊞</span>
        </TBtn>
        <TBtn title="Columns">
          <span style={{ fontSize: "10px" }}>▥</span>
        </TBtn>
        <ToolbarSep />
        <TBtn title="Zoom">
          <span style={{ fontSize: "9px" }}>100%▼</span>
        </TBtn>
      </div>

      {/* ── Formatting Toolbar ── */}
      <div
        style={{
          height: 28,
          backgroundColor: "#D4D0C8",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          borderBottom: "1px solid #ACA899",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <DropdownBox value="Times New Roman" width={130} />
        <div style={{ width: 4 }} />
        <DropdownBox value="12" width={36} />
        <ToolbarSep />
        <TBtn title="Bold" bold>B</TBtn>
        <TBtn title="Italic" italic>I</TBtn>
        <TBtn title="Underline" underline>U</TBtn>
        <ToolbarSep />
        <TBtn title="Align Left">≡</TBtn>
        <TBtn title="Center">
          <span style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            <span style={{ display: "block", width: 10, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 14, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 10, height: 1.5, background: "#000" }} />
          </span>
        </TBtn>
        <TBtn title="Align Right">
          <span style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
            <span style={{ display: "block", width: 10, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 14, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 10, height: 1.5, background: "#000" }} />
          </span>
        </TBtn>
        <TBtn title="Justify">
          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ display: "block", width: 14, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 14, height: 1.5, background: "#000" }} />
            <span style={{ display: "block", width: 14, height: 1.5, background: "#000" }} />
          </span>
        </TBtn>
        <ToolbarSep />
        <TBtn title="Numbering">
          <span style={{ fontSize: "9px" }}>1≡</span>
        </TBtn>
        <TBtn title="Bullets">
          <span style={{ fontSize: "9px" }}>•≡</span>
        </TBtn>
        <ToolbarSep />
        <TBtn title="Decrease Indent">⇤</TBtn>
        <TBtn title="Increase Indent">⇥</TBtn>
        <ToolbarSep />
        <TBtn title="Font Color">
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", lineHeight: 1 }}>A</span>
            <span style={{ display: "block", width: 12, height: 3, background: "#FF0000" }} />
          </span>
        </TBtn>
      </div>

      {/* ── Ruler ── */}
      <div
        style={{
          height: 18,
          backgroundColor: "#D4D0C8",
          borderBottom: "1px solid #ACA899",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 0 0 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ruler track */}
        <div
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: "white",
            border: "1px solid #ACA899",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {/* Ruler ticks */}
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i / 31) * 100}%`,
                bottom: 0,
                width: 1,
                height: i % 4 === 0 ? 8 : i % 2 === 0 ? 5 : 3,
                backgroundColor: "#555",
              }}
            />
          ))}
          {/* Inch numbers */}
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span
              key={n}
              style={{
                position: "absolute",
                left: `${(n / 7) * 100}%`,
                top: 0,
                fontSize: "8px",
                fontFamily: "Tahoma",
                color: "#333",
                transform: "translateX(-50%)",
              }}
            >
              {n}
            </span>
          ))}
        </div>
        <div style={{ width: 20 }} />
      </div>

      {/* ── Document Canvas ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#808080",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "16px 0",
        }}
      >
        {/* White page */}
        <div
          style={{
            width: 570,
            minHeight: "calc(100% - 32px)",
            backgroundColor: "white",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
            padding: "72px 80px",
            fontFamily: "Times New Roman, serif",
            fontSize: "12px",
            lineHeight: "1.5",
            color: "#000",
            boxSizing: "border-box",
          }}
        >
          {/* Blinking cursor placeholder */}
          <span style={{ borderLeft: "1px solid black", animation: "blink 1s step-end infinite" }}>
            &nbsp;
          </span>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div
        style={{
          height: 20,
          backgroundColor: "#D4D0C8",
          borderTop: "1px solid #ACA899",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          fontSize: "11px",
          flexShrink: 0,
          gap: 0,
        }}
      >
        {[
          { label: "Page 1", width: 60 },
          { label: "Sec 1", width: 50 },
          { label: "1/1", width: 36 },
          { label: "At 1\"", width: 48 },
          { label: "Ln 1", width: 40 },
          { label: "Col 1", width: 44 },
        ].map(({ label, width }) => (
          <span
            key={label}
            style={{
              width,
              borderRight: "1px solid #ACA899",
              paddingInline: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {label}
          </span>
        ))}
        <span style={{ marginLeft: 8, color: "#555" }}>English (U.S.)</span>
      </div>

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

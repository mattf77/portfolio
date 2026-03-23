import React, { useState, useRef, useEffect } from "react";

interface Props {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  minimized: boolean;
  initialPos?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  children?: React.ReactNode;
}

const titleBarBtnStyle: React.CSSProperties = {
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
  fontFamily: "Tahoma, sans-serif",
  fontWeight: "bold",
  color: "#000",
  lineHeight: 1,
  flexShrink: 0,
};

const toolbarBtnStyle: React.CSSProperties = {
  height: 22,
  paddingInline: 6,
  backgroundColor: "#D4D0C8",
  border: "1px solid transparent",
  cursor: "default",
  fontSize: "11px",
  fontFamily: "Tahoma, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 3,
  whiteSpace: "nowrap" as const,
};

const menuItemStyle: React.CSSProperties = {
  padding: "1px 6px",
  cursor: "default",
  fontSize: "11px",
  fontFamily: "Tahoma, sans-serif",
};

export function Win2kFolderWindow({
  title,
  onClose,
  onMinimize,
  minimized,
  initialPos = { x: 120, y: 60 },
  initialSize = { width: 620, height: 440 },
  children,
}: Props) {
  const [pos, setPos] = useState(initialPos);
  const [size, setSize] = useState(initialSize);

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
          width: Math.max(320, resizeStart.current.w + e.clientX - resizeStart.current.x),
          height: Math.max(220, resizeStart.current.h + e.clientY - resizeStart.current.y),
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
    e.preventDefault();
    isDragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
  };

  return (
    <div
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
        zIndex: 100,
        userSelect: "none",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
        minWidth: 320,
        minHeight: 220,
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
        {/* Folder icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
          <rect x="0" y="4" width="16" height="11" fill="#F0C040" />
          <rect x="0" y="4" width="16" height="11" fill="none" stroke="#A07000" strokeWidth="0.8" />
          <rect x="0" y="2" width="6" height="3" rx="1" fill="#F0C040" />
          <rect x="0" y="2" width="6" height="3" rx="1" fill="none" stroke="#A07000" strokeWidth="0.8" />
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
          {title}
        </span>

        {/* Window controls */}
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={titleBarBtnStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onMinimize}
          >
            <span style={{ marginTop: 4 }}>_</span>
          </button>
          <button style={titleBarBtnStyle}>
            <span style={{ fontSize: "8px", border: "1px solid #000", width: 8, height: 8, display: "flex", alignItems: "center", justifyContent: "center" }} />
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
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((item) => (
          <span key={item} style={menuItemStyle}>
            {item}
          </span>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div
        style={{
          height: 30,
          backgroundColor: "#D4D0C8",
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          borderBottom: "1px solid #ACA899",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <button style={toolbarBtnStyle}>
          <span style={{ fontSize: "12px" }}>←</span> Back
        </button>
        <button style={toolbarBtnStyle}>
          <span style={{ fontSize: "12px" }}>→</span>
        </button>
        <button style={toolbarBtnStyle}>
          <span style={{ fontSize: "12px" }}>↑</span>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: "#ACA899", margin: "0 3px" }} />

        <button style={toolbarBtnStyle}>Search</button>
        <button style={toolbarBtnStyle}>Folders</button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: "#ACA899", margin: "0 3px" }} />

        {/* Address bar */}
        <span style={{ fontSize: "11px", marginRight: 4 }}>Address</span>
        <div
          style={{
            flex: 1,
            height: 20,
            backgroundColor: "white",
            border: "1px solid #7B9EBD",
            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            padding: "0 4px",
            fontSize: "11px",
            gap: 4,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16">
            <rect x="0" y="4" width="16" height="11" fill="#F0C040" />
            <rect x="0" y="4" width="16" height="11" fill="none" stroke="#A07000" strokeWidth="0.8" />
            <rect x="0" y="2" width="6" height="3" rx="1" fill="#F0C040" />
          </svg>
          {title}
        </div>
        <button style={{ ...toolbarBtnStyle, paddingInline: 8 }}>Go</button>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left pane */}
        <div
          style={{
            width: 170,
            backgroundColor: "#EBE8F5",
            borderRight: "1px solid #ACA899",
            flexShrink: 0,
            overflowY: "auto",
            padding: "6px 0",
          }}
        >
          {/* Section: Other Places */}
          <div
            style={{
              backgroundColor: "#7B7BAD",
              color: "white",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "3px 8px",
              marginBottom: 4,
            }}
          >
            Other Places
          </div>
          {["My Computer", "My Documents", "Shared Documents", "My Network Places"].map((place) => (
            <div
              key={place}
              style={{
                padding: "2px 12px",
                fontSize: "11px",
                cursor: "default",
                color: "#0000CC",
                textDecoration: "underline",
              }}
            >
              {place}
            </div>
          ))}

          {/* Section: Details */}
          <div
            style={{
              backgroundColor: "#7B7BAD",
              color: "white",
              fontSize: "11px",
              fontWeight: "bold",
              padding: "3px 8px",
              margin: "8px 0 4px",
            }}
          >
            Details
          </div>
          <div style={{ padding: "2px 12px", fontSize: "11px", color: "#444" }}>
            <div style={{ fontWeight: "bold" }}>{title}</div>
            <div>File Folder</div>
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            padding: 12,
            overflowY: "auto",
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: 8,
          }}
        >
          {children}
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
          color: "#000",
          flexShrink: 0,
          gap: 16,
        }}
      >
        <span>0 objects</span>
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
          backgroundImage:
            "radial-gradient(circle, #808080 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "2px 2px",
        }}
      />
    </div>
  );
}

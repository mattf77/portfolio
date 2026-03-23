import React, { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  arrow?: boolean;
  separator?: false;
}
interface SeparatorItem {
  separator: true;
}
type Item = MenuItem | SeparatorItem;

const ITEMS: Item[] = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#1A6FBF" stroke="#0A3F80" strokeWidth="0.5" />
        <ellipse cx="8" cy="8" rx="3.5" ry="7" fill="none" stroke="#6BB8F0" strokeWidth="0.8" />
        <line x1="1" y1="8" x2="15" y2="8" stroke="#6BB8F0" strokeWidth="0.8" />
        <line x1="8" y1="1" x2="8" y2="15" stroke="#6BB8F0" strokeWidth="0.8" />
      </svg>
    ),
    label: "Windows Update",
  },
  { separator: true },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <rect x="1" y="3" width="14" height="10" rx="1" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.8" />
        <rect x="1" y="3" width="14" height="3" fill="#1565C0" rx="1" />
        <line x1="3" y1="9"  x2="13" y2="9"  stroke="#ccc" strokeWidth="0.8" />
        <line x1="3" y1="11" x2="10" y2="11" stroke="#ccc" strokeWidth="0.8" />
      </svg>
    ),
    label: "Programs",
    arrow: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <rect x="2" y="2" width="12" height="9" rx="1" fill="#F5F5F5" stroke="#9E9E9E" strokeWidth="0.8" />
        <line x1="4" y1="5" x2="12" y2="5" stroke="#9E9E9E" strokeWidth="0.8" />
        <line x1="4" y1="7" x2="12" y2="7" stroke="#9E9E9E" strokeWidth="0.8" />
        <line x1="4" y1="9" x2="9"  y2="9" stroke="#9E9E9E" strokeWidth="0.8" />
        <rect x="4" y="12" width="8" height="2" rx="0.5" fill="#9E9E9E" />
      </svg>
    ),
    label: "Documents",
    arrow: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <rect x="1" y="4" width="14" height="9" rx="1" fill="#D4D0C8" stroke="#808080" strokeWidth="0.8" />
        <rect x="3" y="6" width="4" height="3" rx="0.5" fill="#1565C0" />
        <rect x="9" y="6" width="4" height="1" rx="0.5" fill="#808080" />
        <rect x="9" y="8" width="3" height="1" rx="0.5" fill="#808080" />
        <rect x="3" y="2" width="5" height="3" rx="0.5" fill="#D4D0C8" stroke="#808080" strokeWidth="0.8" />
      </svg>
    ),
    label: "Settings",
    arrow: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <circle cx="7" cy="7" r="5" fill="none" stroke="#808080" strokeWidth="1.5" />
        <line x1="11" y1="11" x2="15" y2="15" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Search",
    arrow: true,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <circle cx="8" cy="6" r="4" fill="#F0C040" stroke="#A07000" strokeWidth="0.8" />
        <text x="7" y="9" fontSize="7" fontWeight="bold" fill="#A07000" fontFamily="serif">?</text>
        <rect x="6" y="11" width="4" height="4" rx="0.5" fill="#F0C040" stroke="#A07000" strokeWidth="0.8" />
      </svg>
    ),
    label: "Help",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <rect x="1" y="4" width="10" height="8" rx="1" fill="#FFFDE7" stroke="#9E9E9E" strokeWidth="0.8" />
        <rect x="5" y="7" width="10" height="5" rx="1" fill="#D4D0C8" stroke="#808080" strokeWidth="0.8" />
        <rect x="7" y="9" width="3" height="1.5" rx="0.3" fill="#808080" />
      </svg>
    ),
    label: "Run...",
  },
  { separator: true },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="8" rx="1" fill="#D4D0C8" stroke="#808080" strokeWidth="0.8" />
        <rect x="4" y="5" width="8" height="4" rx="0.5" fill="#1565C0" />
        <rect x="5" y="12" width="2" height="1.5" fill="#808080" />
        <rect x="9" y="12" width="2" height="1.5" fill="#808080" />
        <rect x="3" y="13" width="10" height="1" rx="0.5" fill="#808080" />
      </svg>
    ),
    label: "Shut Down...",
  },
];

function MenuRow({ item }: { item: Item }) {
  const [hovered, setHovered] = React.useState(false);

  if ("separator" in item && item.separator) {
    return (
      <div style={{ padding: "4px 6px 4px 36px" }}>
        <div style={{ width: "100%", height: 1, backgroundColor: "#ACA899" }} />
        <div style={{ width: "100%", height: 1, backgroundColor: "#fff" }} />
      </div>
    );
  }

  const mi = item as MenuItem;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 28,
        display: "flex",
        alignItems: "center",
        paddingLeft: 4,
        paddingRight: 8,
        gap: 8,
        backgroundColor: hovered ? "#0A246A" : "transparent",
        cursor: "default",
      }}
    >
      <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {mi.icon}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: "12px",
          fontFamily: "Tahoma, sans-serif",
          color: hovered ? "#fff" : "#000",
          whiteSpace: "nowrap",
        }}
      >
        {mi.label}
      </span>
      {mi.arrow && (
        <span style={{ fontSize: "10px", color: hovered ? "#fff" : "#000" }}>▶</span>
      )}
    </div>
  );
}

export function Win2kStartMenu({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Slight delay so the start-button click that opens it doesn't immediately close it
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: 36,          // sits just above the taskbar
        left: 0,
        display: "flex",
        flexDirection: "row",
        zIndex: 9999,
        border: "2px solid #808080",
        boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #404040, 3px 3px 6px rgba(0,0,0,0.4)",
        userSelect: "none",
      }}
    >
      {/* ── Left banner ── */}
      <div
        style={{
          width: 34,
          background: "linear-gradient(to top, #1C3C8C, #0A1A4A)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 10,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            fontFamily: "Tahoma, sans-serif",
            fontWeight: "bold",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "2px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#fff" }}>Windows</span>
          {" "}
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: "normal", fontSize: "13px" }}>2000 Professional</span>
        </span>
      </div>

      {/* ── Menu items ── */}
      <div
        style={{
          backgroundColor: "#D4D0C8",
          minWidth: 230,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        {ITEMS.map((item, i) => (
          <MenuRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

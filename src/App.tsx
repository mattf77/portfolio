import React, { useState, useRef } from "react";
import { Flex, Group, Button, Image } from "@mantine/core";
import { Win2kClock } from "./components/Win2kClock";
import { Win2kFolderWindow } from "./components/Win2kFolderWindow";
import { Win2kWordWindow } from "./components/Win2kWordWindow";
import { Win2kWelcomeDialog } from "./components/Win2kWelcomeDialog";
import { Win2kNotepadWindow } from "./components/Win2kNotepadWindow";
import { Win2kStartMenu } from "./components/Win2kStartMenu";
import { Win2kRunDialog } from "./components/Win2kRunDialog";

import ieLogo from "/ielogo.png";
import emailLogo from "/emailicon.webp";
import explorerLogo from "/explorericon.svg";
import notepadLogo from "/notepadlogo.webp";
import startIcon from "/starticon3.png";
import windowsWallpaper from "/windowsxpultrawide.jpg"
import folderIcon from "/folder_icon.png"
import wordIcon from "/word_icon_3.png"
import notepadIcon from "/notepad_icon_2.webp"


/* ------------------ WINDOWS 2000 DIVIDER ------------------ */

function Win2kDivider() {
  return (
    <div
      style={{
        width: 2,
        height: 22,
        margin: "0 4px",
        display: "flex",
      }}
    >
      <div style={{ width: 1, backgroundColor: "#DFDFDF" }} />
      <div style={{ width: 1, backgroundColor: "#316AC5" }} />
    </div>
  );
}

/* ------------------ APP ------------------ */

const ICON_DEFS = [
  { id: "resume",   src: wordIcon,    label: "Resume" },
  { id: "projects", src: folderIcon,  label: "Projects" },
  { id: "aboutme",  src: notepadIcon, label: "AboutMe.txt" },
];

export default function App() {
  // Unified icon positions
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>({
    resume:   { x: 16, y: 16 },
    projects: { x: 16, y: 114 },
    aboutme:  { x: 16, y: 212 },
  });

  // Unified selection + drag
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [draggingIcons, setDraggingIcons] = useState(false);
  const dragOffsetsRef = useRef<Record<string, { x: number; y: number }>>({});

  // Rubber-band selection
  const [rubberBand, setRubberBand] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const isRubberBanding = useRef(false);

  // Window open/minimized state
  const [projectsWindowOpen, setProjectsWindowOpen] = useState(false);
  const [projectsMinimized, setProjectsMinimized] = useState(false);
  const [resumeWindowOpen, setResumeWindowOpen] = useState(false);
  const [resumeWindowMinimized, setResumeWindowMinimized] = useState(false);
  const [aboutmeWindowOpen, setAboutmeWindowOpen] = useState(false);
  const [aboutmeMinimized, setAboutmeMinimized] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);

  const handleRunCommand = (cmd: string) => {
    if (cmd === "winword" || cmd === "winword.exe") {
      setResumeWindowOpen(true); setResumeWindowMinimized(false); bringToFront("resume");
    } else if (cmd === "explorer" || cmd === "explorer.exe") {
      setProjectsWindowOpen(true); setProjectsMinimized(false); bringToFront("projects");
    } else if (cmd === "notepad" || cmd === "notepad.exe") {
      setAboutmeWindowOpen(true); setAboutmeMinimized(false); bringToFront("aboutme");
    }
  };

  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const bringToFront = (id: string) =>
    setWindowOrder((prev) => [...prev.filter((w) => w !== id), id]);
  const zIndexOf = (id: string) => 100 + windowOrder.indexOf(id);

  // ---- Icon mouse handlers ----

  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // Determine which icons to drag: if clicking an already-selected icon in a
    // multi-selection, drag them all; otherwise select only this one.
    const iconsToSelect: Set<string> =
      selectedIcons.has(id) && selectedIcons.size > 1
        ? selectedIcons
        : new Set([id]);

    setSelectedIcons(iconsToSelect);

    const offsets: Record<string, { x: number; y: number }> = {};
    iconsToSelect.forEach((iconId) => {
      offsets[iconId] = {
        x: e.clientX - iconPositions[iconId].x,
        y: e.clientY - iconPositions[iconId].y,
      };
    });
    dragOffsetsRef.current = offsets;
    setDraggingIcons(true);
  };

  // ---- Desktop mouse handlers ----

  const handleDesktopMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedIcons(new Set());
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isRubberBanding.current = true;
    setRubberBand({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIcons && Object.keys(dragOffsetsRef.current).length > 0) {
      const updates: Record<string, { x: number; y: number }> = {};
      Object.entries(dragOffsetsRef.current).forEach(([iconId, offset]) => {
        updates[iconId] = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        };
      });
      setIconPositions((prev) => ({ ...prev, ...updates }));
    }

    if (isRubberBanding.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRubberBand((prev) => (prev ? { ...prev, x2: x, y2: y } : null));
    }
  };

  const handleMouseUp = () => {
    setDraggingIcons(false);
    dragOffsetsRef.current = {};

    if (isRubberBanding.current) {
      isRubberBanding.current = false;
      setRubberBand((prev) => {
        if (!prev) return null;
        const minX = Math.min(prev.x1, prev.x2);
        const maxX = Math.max(prev.x1, prev.x2);
        const minY = Math.min(prev.y1, prev.y2);
        const maxY = Math.max(prev.y1, prev.y2);

        // Only select if the rect has meaningful size (not just a click)
        if (maxX - minX > 4 || maxY - minY > 4) {
          const newSelected = new Set<string>();
          Object.entries(iconPositions).forEach(([iconId, pos]) => {
            // Icon bounding box: 48px wide, ~72px tall (icon + label)
            if (pos.x < maxX && pos.x + 48 > minX && pos.y < maxY && pos.y + 72 > minY) {
              newSelected.add(iconId);
            }
          });
          setSelectedIcons(newSelected);
        }
        return null;
      });
    }
  };

  return (
    <Flex
      direction="column"
      justify="space-between"
      style={{
        height: "100dvh",
        width: "100%",
        backgroundColor: "#000000",
        fontFamily: "Tahoma, sans-serif",
      }}
    >
      {/* Desktop area */}
      <Flex
        style={{
          flex: 1,
          padding: "16px",
          backgroundImage: `url(${windowsWallpaper})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          position: "relative",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleDesktopMouseDown}
      >
        {/* Desktop Icons */}
        {ICON_DEFS.map(({ id, src, label }) => {
          const pos = iconPositions[id];
          const isSelected = selectedIcons.has(id);
          const onDoubleClick =
            id === "resume"
              ? () => { setResumeWindowOpen(true); setResumeWindowMinimized(false); bringToFront("resume"); }
              : id === "projects"
              ? () => { setProjectsWindowOpen(true); setProjectsMinimized(false); bringToFront("projects"); }
              : () => { setAboutmeWindowOpen(true); setAboutmeMinimized(false); bringToFront("aboutme"); };

          return (
            <div
              key={id}
              onMouseDown={(e) => handleIconMouseDown(e, id)}
              onDoubleClick={onDoubleClick}
              style={{
                position: "absolute",
                top: pos.y,
                left: pos.x,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 48,
                cursor: "default",
                userSelect: "none",
              }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  width: 48,
                  height: "auto",
                  imageRendering: "pixelated",
                  marginBottom: 4,
                }}
              />
              <span
                style={{
                  color: "white",
                  fontSize: "11px",
                  fontFamily: "Tahoma, sans-serif",
                  fontWeight: "lighter",
                  textAlign: "center",
                  display: "inline-block",
                  whiteSpace: "normal",
                  width: "fit-content",
                  padding: isSelected ? "1px 2px" : "0px",
                  backgroundColor: isSelected ? "#0A246A" : "transparent",
                  borderRadius: 2,
                  textShadow: isSelected ? "none" : "1px 1px 2px #000",
                  letterSpacing: "1px",
                  lineHeight: "16px",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}

        {/* Rubber-band selection rectangle */}
        {rubberBand && (
          <div
            style={{
              position: "absolute",
              left: Math.min(rubberBand.x1, rubberBand.x2),
              top: Math.min(rubberBand.y1, rubberBand.y2),
              width: Math.abs(rubberBand.x2 - rubberBand.x1),
              height: Math.abs(rubberBand.y2 - rubberBand.y1),
              border: "1px dotted #FFFFFF",
              backgroundColor: "rgba(0, 78, 152, 0.25)",
              pointerEvents: "none",
              zIndex: 99,
            }}
          />
        )}

        {projectsWindowOpen && (
          <Win2kFolderWindow
            title="Projects"
            minimized={projectsMinimized}
            zIndex={zIndexOf("projects")}
            onFocus={() => bringToFront("projects")}
            onClose={() => { setProjectsWindowOpen(false); setProjectsMinimized(false); }}
            onMinimize={() => setProjectsMinimized(true)}
          />
        )}

        {resumeWindowOpen && (
          <Win2kWordWindow
            minimized={resumeWindowMinimized}
            zIndex={zIndexOf("resume")}
            onFocus={() => bringToFront("resume")}
            onClose={() => { setResumeWindowOpen(false); setResumeWindowMinimized(false); }}
            onMinimize={() => setResumeWindowMinimized(true)}
          />
        )}

        {aboutmeWindowOpen && (
          <Win2kNotepadWindow
            minimized={aboutmeMinimized}
            zIndex={zIndexOf("aboutme")}
            onFocus={() => bringToFront("aboutme")}
            onClose={() => { setAboutmeWindowOpen(false); setAboutmeMinimized(false); }}
            onMinimize={() => setAboutmeMinimized(true)}
          />
        )}

        {showWelcome && (
          <Win2kWelcomeDialog onClose={() => setShowWelcome(false)} />
        )}

        {startMenuOpen && (
          <Win2kStartMenu
            onClose={() => setStartMenuOpen(false)}
            onRun={() => setRunDialogOpen(true)}
            onOpenWord={() => { setResumeWindowOpen(true); setResumeWindowMinimized(false); bringToFront("resume"); }}
            onOpenExplorer={() => { setProjectsWindowOpen(true); setProjectsMinimized(false); bringToFront("projects"); }}
            onOpenNotepad={() => { setAboutmeWindowOpen(true); setAboutmeMinimized(false); bringToFront("aboutme"); }}
            onOpenResume={() => { setResumeWindowOpen(true); setResumeWindowMinimized(false); bringToFront("resume"); }}
            onOpenAboutMe={() => { setAboutmeWindowOpen(true); setAboutmeMinimized(false); bringToFront("aboutme"); }}
          />
        )}

        {runDialogOpen && (
          <Win2kRunDialog onClose={() => setRunDialogOpen(false)} onRun={handleRunCommand} />
        )}
      </Flex>

      {/* Taskbar */}
      <Flex
        align="center"
        style={{
          height: "32px",
          minHeight: "4vh",
          backgroundColor: "#245EDC",
          padding: "0 3px",
          boxSizing: "border-box",
          borderTop: "1px solid #4A7BD0",
          borderBottom: "1px solid #1A3F8F",
          boxShadow: `
            inset 0 1px 0 #DFDFDF,
            inset 0 -1px 0 #808080
          `,
        }}
      >
        {/* LEFT SIDE: Start + Quick Launch + Open Apps */}
        <Flex align="center" gap={4}>
          {/* Start button */}
          <Button
            variant="default"
            h={26}
            px={6}
            onClick={() => setStartMenuOpen((o) => !o)}
            style={{
              display: "flex",
              color: "white",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#3CB043",
              borderTop: "1px solid #FFFFFF",
              borderLeft: "1px solid #FFFFFF",
              borderRight: "1px solid #2A7A32",
              borderBottom: "1px solid #2A7A32",
              boxShadow:
                "inset 1px 1px 0 #DFDFDF, inset -1px -1px 0 #404040",
              borderRadius: 0,
              cursor: "default",
              letterSpacing: '1px',
            }}
          >
            <Image
              src={startIcon}
              alt=""
              style={{
                width: 24,
                height: 24,
                imageRendering: "pixelated",
                display: "block",
                marginRight: 2,
              }}
            />
            Start
          </Button>

          <Win2kDivider />

          {/* Quick Launch */}
          <Group gap={6}>
            <Image src={ieLogo} alt="IE" style={{ width: 20, height: 20, imageRendering: "pixelated", display: "block" }} />
            <Image src={emailLogo} alt="Email" style={{ width: 20, height: 20, imageRendering: "pixelated", display: "block" }} />
            <Image src={explorerLogo} alt="Explorer" style={{ width: 20, height: 20, imageRendering: "pixelated", display: "block" }} />
            <Image src={notepadLogo} alt="Notepad" style={{ width: 20, height: 20, imageRendering: "pixelated", display: "block" }} />
          </Group>

          <Win2kDivider />

          {/* Open apps */}
          <Group gap={2}>
            {aboutmeWindowOpen && (
              <button
                onClick={() => {
                  if (aboutmeMinimized) { setAboutmeMinimized(false); bringToFront("aboutme"); }
                  else { setAboutmeMinimized(true); }
                }}
                style={{
                  height: 26, minWidth: 120, maxWidth: 160,
                  backgroundColor: aboutmeMinimized ? "#245EDC" : "#1A3F8F",
                  color: "#FFFFFF", fontFamily: "Tahoma, sans-serif", fontSize: "11px",
                  padding: "0 8px 0 4px", boxSizing: "border-box", borderRadius: 0, border: "none",
                  borderTop: aboutmeMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderLeft: aboutmeMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderRight: aboutmeMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  borderBottom: aboutmeMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  boxShadow: aboutmeMinimized ? "inset 1px 1px 0 rgba(255,255,255,0.1)" : "inset 1px 1px 0 #0A246A, inset -1px -1px 0 #4A7BD0",
                  cursor: "default", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 4,
                }}
              >
                <img src={notepadIcon} alt="" draggable={false} style={{ height: 16, imageRendering: "pixelated", display: "block" }} />
                AboutMe.txt - Notepad
              </button>
            )}
            {resumeWindowOpen && (
              <button
                onClick={() => { setResumeWindowMinimized(!resumeWindowMinimized); bringToFront("resume"); }}
                style={{
                  height: 26, minWidth: 120, maxWidth: 160,
                  backgroundColor: resumeWindowMinimized ? "#245EDC" : "#1A3F8F",
                  color: "#FFFFFF", fontFamily: "Tahoma, sans-serif", fontSize: "11px",
                  padding: "0 8px 0 4px", boxSizing: "border-box", borderRadius: 0, border: "none",
                  borderTop: resumeWindowMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderLeft: resumeWindowMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderRight: resumeWindowMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  borderBottom: resumeWindowMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  boxShadow: resumeWindowMinimized ? "inset 1px 1px 0 rgba(255,255,255,0.1)" : "inset 1px 1px 0 #0A246A, inset -1px -1px 0 #4A7BD0",
                  cursor: "default", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 4,
                }}
              >
                <img src={wordIcon} alt="" draggable={false} style={{ height: 16, imageRendering: "pixelated", display: "block" }} />
                Resume - Microsoft Word
              </button>
            )}
            {projectsWindowOpen && (
              <button
                onClick={() => {
                  if (projectsMinimized) { setProjectsMinimized(false); bringToFront("projects"); }
                  else { setProjectsMinimized(true); }
                }}
                style={{
                  height: 26, minWidth: 120, maxWidth: 160,
                  backgroundColor: projectsMinimized ? "#245EDC" : "#1A3F8F",
                  color: "#FFFFFF", fontFamily: "Tahoma, sans-serif", fontSize: "11px",
                  padding: "0 8px 0 4px", boxSizing: "border-box", borderRadius: 0, border: "none",
                  borderTop: projectsMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderLeft: projectsMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderRight: projectsMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  borderBottom: projectsMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  boxShadow: projectsMinimized ? "inset 1px 1px 0 rgba(255,255,255,0.1)" : "inset 1px 1px 0 #0A246A, inset -1px -1px 0 #4A7BD0",
                  cursor: "default", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 4,
                }}
              >
                <img src={folderIcon} alt="" draggable={false} style={{ height: 16, imageRendering: "pixelated", display: "block" }} />
                Projects
              </button>
            )}
          </Group>
        </Flex>

        <div style={{ marginLeft: "auto" }}>
          <Win2kClock />
        </div>
      </Flex>
    </Flex>
  );
}

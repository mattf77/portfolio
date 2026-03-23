import React, { useState } from "react";
import { Flex, Group, Button, Image } from "@mantine/core";
import { Win2kClock } from "./components/Win2kClock";
import { Win2kFolderWindow } from "./components/Win2kFolderWindow";
import { Win2kWordWindow } from "./components/Win2kWordWindow";

import ieLogo from "/ielogo.png";
import emailLogo from "/emailicon.webp";
import explorerLogo from "/explorericon.svg";
import notepadLogo from "/notepadlogo.webp";
import startIcon from "/starticon3.png";
import windowsWallpaper from "/windowsxpultrawide.jpg"
import folderIcon from "/folder_icon.png"
import wordIcon from "/word_icon_3.png"


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

export default function App() {
  // Desktop icon positions
  const [resumePos, setResumePos] = useState({ x: 16, y: 16 });

  // Dragging + selection state
  const [resumeDragging, setResumeDragging] = useState(false);
  const [resumeSelected, setResumeSelected] = useState(false);
  const [resumeOffset, setResumeOffset] = useState({ x: 0, y: 0 });

  const [projectsPos, setProjectsPos] = useState({ x: 16, y: 114 });
  const [projectsDragging, setProjectsDragging] = useState(false);
  const [projectsSelected, setProjectsSelected] = useState(false);
  const [projectsOffset, setProjectsOffset] = useState({ x: 0, y: 0 });
  const [projectsWindowOpen, setProjectsWindowOpen] = useState(false);
  const [projectsMinimized, setProjectsMinimized] = useState(false);

  const [resumeWindowOpen, setResumeWindowOpen] = useState(false);
  const [resumeWindowMinimized, setResumeWindowMinimized] = useState(false);

  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const bringToFront = (id: string) =>
    setWindowOrder((prev) => [...prev.filter((w) => w !== id), id]);
  const zIndexOf = (id: string) => 100 + windowOrder.indexOf(id);

  const handleResumeMouseDown = (e: React.MouseEvent) => {
    setResumeSelected(true);
    setResumeDragging(true);
    setResumeOffset({
      x: e.clientX - resumePos.x,
      y: e.clientY - resumePos.y,
    });
  };

  const handleProjectsMouseDown = (e: React.MouseEvent) => {
    setProjectsSelected(true);
    setProjectsDragging(true);
    setProjectsOffset({
      x: e.clientX - projectsPos.x,
      y: e.clientY - projectsPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (resumeDragging) {
      setResumePos({
        x: e.clientX - resumeOffset.x,
        y: e.clientY - resumeOffset.y,
      });
    }
    if (projectsDragging) {
      setProjectsPos({
        x: e.clientX - projectsOffset.x,
        y: e.clientY - projectsOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setResumeDragging(false);
    setProjectsDragging(false);
  };

  const handleDesktopClick = () => {
    if (!resumeDragging) setResumeSelected(false);
    if (!projectsDragging) setProjectsSelected(false);
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
              backgroundRepeat: "no-repeat",     // ← REQUIRED
    backgroundPosition: "center",      // or "center -80px" for XP crop
    backgroundSize: "cover",  
          position: "relative",


        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleDesktopClick}
      >
        {/* Resume Desktop Icon */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            handleResumeMouseDown(e);
          }}
          onClick={() => { setResumeWindowOpen(true); bringToFront("resume"); }}
          style={{
            position: "absolute",
            top: resumePos.y,
            left: resumePos.x,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 70,
            cursor: "default",
            userSelect: "none",
          }}
        >
          <img
            src={wordIcon}
            alt=""
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              width: 70,
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
              padding: resumeSelected ? "1px 2px" : "0px",
              backgroundColor: resumeSelected ? "#0A246A" : "transparent",
              borderRadius: 2,
              textShadow: resumeSelected ? "none" : "1px 1px 2px #000",
              letterSpacing: "1px",
              lineHeight: "16px",
            }}
          >
            Resume
          </span>
        </div>

        {/* Projects Desktop Icon */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            handleProjectsMouseDown(e);
          }}
          onClick={() => { setProjectsWindowOpen(true); bringToFront("projects"); }}
          style={{
            position: "absolute",
            top: projectsPos.y,
            left: projectsPos.x,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 70,
            cursor: "default",
            userSelect: "none",
          }}
        >
          <img
            src={folderIcon}
            alt=""
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              width: 70,
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
              padding: projectsSelected ? "1px 2px" : "0px",
              backgroundColor: projectsSelected ? "#0A246A" : "transparent",
              borderRadius: 2,
              textShadow: projectsSelected ? "none" : "1px 1px 2px #000",
              letterSpacing: "1px",
              lineHeight: "16px",
            }}
          >
            Projects
          </span>
        </div>

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
      </Flex>

      {/* Taskbar */}
      <Flex
        align="center"
        style={{
          height: "32px",
          minHeight: "3.5vh",
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
              }}
            />
            Start
          </Button>

          <Win2kDivider />

          {/* Quick Launch */}
          <Group gap={6}>
  {/* 1st icon — Internet Explorer */}
  <Image
    src={ieLogo}
    alt="IE"
    style={{
      width: 20,
      height: 20,
      imageRendering: "pixelated",
      display: "block",
    }}
  />

  {/* 2nd icon — Email */}
  <Image
    src={emailLogo}
    alt="Email"
    style={{
      width: 20,
      height: 20,
      imageRendering: "pixelated",
      display: "block",
    }}
  />

  {/* 3rd icon — Explorer */}
  <Image
    src={explorerLogo}
    alt="Explorer"
    style={{
      width: 20,
      height: 20,
      imageRendering: "pixelated",
      display: "block",
    }}
  />

  {/* 4th icon — Notepad */}
  <Image
    src={notepadLogo}
    alt="Notepad"
    style={{
      width: 20,
      height: 20,
      imageRendering: "pixelated",
      display: "block",
    }}
  />
</Group>

          <Win2kDivider />

          {/* Open apps */}
          <Group gap="xs">
            {resumeWindowOpen && (
              <button
                onClick={() => { setResumeWindowMinimized(!resumeWindowMinimized); bringToFront("resume"); }}
                style={{
                  height: 26,
                  minWidth: 120,
                  maxWidth: 160,
                  backgroundColor: resumeWindowMinimized ? "#245EDC" : "#1A3F8F",
                  color: "#FFFFFF",
                  fontFamily: "Tahoma, sans-serif",
                  fontSize: "11px",
                  padding: "0 8px 0 4px",
                  boxSizing: "border-box",
                  borderRadius: 0,
                  border: "none",
                  borderTop: resumeWindowMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderLeft: resumeWindowMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderRight: resumeWindowMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  borderBottom: resumeWindowMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  boxShadow: resumeWindowMinimized
                    ? "inset 1px 1px 0 rgba(255,255,255,0.1)"
                    : "inset 1px 1px 0 #0A246A, inset -1px -1px 0 #4A7BD0",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 4,
                }}
              >
                <img
                  src={wordIcon}
                  alt=""
                  draggable={false}
                  style={{ height: 16, imageRendering: "pixelated", display: "block" }}
                />
                Resume - Microsoft Word
              </button>
            )}
            {projectsWindowOpen && (
              <button
                onClick={() => {
                  if (projectsMinimized) {
                    setProjectsMinimized(false);
                    bringToFront("projects");
                  } else {
                    setProjectsMinimized(true);
                  }
                }}
                style={{
                  height: 26,
                  minWidth: 120,
                  maxWidth: 160,
                  backgroundColor: projectsMinimized ? "#245EDC" : "#1A3F8F",
                  color: "#FFFFFF",
                  fontFamily: "Tahoma, sans-serif",
                  fontSize: "11px",
                  padding: "0 8px 0 4px",
                  boxSizing: "border-box",
                  borderRadius: 0,
                  border: "none",
                  borderTop: projectsMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderLeft: projectsMinimized ? "1px solid #4A7BD0" : "1px solid #0A246A",
                  borderRight: projectsMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  borderBottom: projectsMinimized ? "1px solid #0A246A" : "1px solid #4A7BD0",
                  boxShadow: projectsMinimized
                    ? "inset 1px 1px 0 rgba(255,255,255,0.1)"
                    : "inset 1px 1px 0 #0A246A, inset -1px -1px 0 #4A7BD0",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 4,
                }}
              >
                <img
                  src={folderIcon}
                  alt=""
                  draggable={false}
                  style={{ height: 16, imageRendering: "pixelated", display: "block" }}
                />
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
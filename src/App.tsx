import React, { useState } from "react";
import { Flex, Group, Button, Image } from "@mantine/core";
import { Win2kClock } from "./components/Win2kClock";

import ieLogo from "/ielogo.png";
import emailLogo from "/emailicon.webp";
import explorerLogo from "/explorericon.svg";
import notepadLogo from "/notepadlogo.webp";
import startIcon from "/starticon3.png";


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
      <div style={{ width: 1, backgroundColor: "#808080" }} />
    </div>
  );
}

/* ------------------ APP ------------------ */

export default function App() {
  // Desktop icon position
  const [iconPos, setIconPos] = useState({ x: 16, y: 16 });

  // Dragging + selection state
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setSelected(true);
    setDragging(true);
    setOffset({
      x: e.clientX - iconPos.x,
      y: e.clientY - iconPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setIconPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleDesktopClick = () => {
    if (!dragging) setSelected(false);
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
          backgroundColor: "#3A6EA5",
          position: "relative",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleDesktopClick}
      >
        {/* Draggable Desktop Icon */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e);
          }}
          style={{
            position: "absolute",
            top: iconPos.y,
            left: iconPos.x,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 70,
            cursor: "default",
            userSelect: "none",
          }}
        >
          <img
            src={ieLogo}
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

          {/* Win2k-style selection highlight */}
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

              padding: selected ? "1px 2px" : "0px",
              backgroundColor: selected ? "#0A246A" : "transparent",
              borderRadius: 2,

              textShadow: selected ? "none" : "1px 1px 2px #000",

              letterSpacing: "1px",
              lineHeight: "16px",
            }}
          >
            Internet Explorer
          </span>
        </div>
      </Flex>

      {/* Taskbar */}
      <Flex
        align="center"
        style={{
          height: "32px",
          backgroundColor: "#C0C0C0",
          padding: "0 3px",
          boxSizing: "border-box",
          borderTop: "1px solid #FFFFFF",
          borderBottom: "1px solid #404040",
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
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#C0C0C0",
              borderTop: "1px solid #FFFFFF",
              borderLeft: "1px solid #FFFFFF",
              borderRight: "1px solid #808080",
              borderBottom: "1px solid #808080",
              boxShadow:
                "inset 1px 1px 0 #DFDFDF, inset -1px -1px 0 #404040",
              borderRadius: 0,
              cursor: "default",   
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
            {["Internet Explorer"].map((app) => (
              <Button
  key={app}
  variant="default"
  h={26}
  styles={{
  root: {
    backgroundColor: "#E0E0E0",
    color: "#000",
    fontFamily: "Tahoma, sans-serif",
    fontSize: "12px",

    padding: "2px 12px 2px 2px",   // ← asymmetric padding (TOP RIGHT BOTTOM LEFT)

    boxSizing: "border-box",
    borderRadius: 0,

    borderTop: "1px solid #404040",
    borderLeft: "1px solid #404040",
    borderRight: "1px solid #FFFFFF",
    borderBottom: "1px solid #FFFFFF",

    boxShadow: `
      inset 1px 1px 0 #808080,
      inset -1px -1px 0 #DFDFDF
    `,

    cursor: "default",

    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "2px",   // tight icon/text spacing
  },
}}
>
  {/* IE icon inside the taskbar button */}
  <img
    src={ieLogo}
    alt=""
    draggable={false}
    onDragStart={(e) => e.preventDefault()}
    style={{
      height: 20,
      imageRendering: "pixelated",
      display: "block",
    }}
  />

  {app}
</Button>
            ))}
          </Group>
        </Flex>

        <div style={{ marginLeft: "auto" }}>
          <Win2kClock />
        </div>
      </Flex>
    </Flex>
  );
}
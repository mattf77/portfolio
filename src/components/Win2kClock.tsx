import { Flex, Group, Image } from "@mantine/core";
import { useState, useEffect } from "react";

import audioIcon from "/soundIcon5.png";

export function Win2kClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setTime(formatted);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: 26,
        minWidth: 60,
        padding: "0 6px",
        backgroundColor: "#245EDC",
        fontSize: "12px",
        fontFamily: "Tahoma, sans-serif",
        color: "#FFFFFF",
        userSelect: "none",

        // Sunken bevel
        borderTop: "1px solid #1A3F8F",
        borderLeft: "1px solid #1A3F8F",
        borderRight: "1px solid #4A7BD0",
        borderBottom: "1px solid #4A7BD0",

        boxShadow: `
          inset 1px 1px 0 #1A3F8F,
          inset -1px -1px 0 #DFDFDF
        `,
      }}
    >
        {/* Quick Launch: 3 empty icons */}
                  <Group gap={2} mr="10px">

  <Image
    src={audioIcon}
    alt="Audio"
    style={{
      height: 16,
      imageRendering: "pixelated",
      display: "block",
    }}
  />
</Group>
      {time}
    </Flex>
  );
}
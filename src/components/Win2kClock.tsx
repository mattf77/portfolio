import { Flex, Group, Image } from "@mantine/core";
import { useState, useEffect } from "react";

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
        backgroundColor: "#C0C0C0",
        fontSize: "12px",
        fontFamily: "Tahoma, sans-serif",
        color: "#000",
        userSelect: "none",

        // Sunken bevel
        borderTop: "1px solid #808080",
        borderLeft: "1px solid #808080",
        borderRight: "1px solid #FFFFFF",
        borderBottom: "1px solid #FFFFFF",

        boxShadow: `
          inset 1px 1px 0 #404040,
          inset -1px -1px 0 #DFDFDF
        `,
      }}
    >
        {/* Quick Launch: 3 empty icons */}
                  <Group gap={2}>
            {[1, 2].map((i) => (
              <Image
                key={i}
                src={""}
                w={20}
                style={{
                  backgroundColor: "#D4D0C8",
                  width: 20,
                  height: 20,
                }}
              />
            ))}
          </Group>
      {time}
    </Flex>
  );
}
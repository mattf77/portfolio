import { Button, Flex, Group, Text } from "@mantine/core";

export default function Navbar() {
  return (
    <div
      style={{
        height: "75px",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        boxSizing: "border-box",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {/* Left: Logo */}
      <Flex w="100px" >
      <Text c="red" size="xl" fw={700}>
        R
      </Text>
      <Text c="green" size="xl" fw={700}>
        G
      </Text>
      <Text c="blue" size="xl" fw={700}>
        B
      </Text>
      <Text size="xl" fw={700} ml=".3rem">
        PCs
      </Text>
      </Flex>

      {/* Middle: Category Links */}
      <Group gap="xl">
        <Text size="md" fw={500} style={{ cursor: "pointer" }}>
          Category 1
        </Text>
        <Text size="md" fw={500} style={{ cursor: "pointer" }}>
          Category 2
        </Text>
        <Text size="md" fw={500} style={{ cursor: "pointer" }}>
          Category 3
        </Text>
      </Group>

      {/* Right: Auth Buttons */}
      <Group>
        <Button variant="subtle" color="dark">
          Log In
        </Button>
        <Button color="black">Sign Up</Button>
      </Group>
    </div>
  );
}
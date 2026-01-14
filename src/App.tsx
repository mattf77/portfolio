import Navbar from "./components/Navbar";
import { Button, Flex } from "@mantine/core";

export default function App() {
  return (
    <>
      <Navbar />

      <Flex w="100%" h="600px" bg="black" justify="center" align="center">
        
      </Flex>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "calc(100vh - 150px)",
          backgroundColor: "white",
        }}
      >
        <Button color="black">Button</Button>
      </div>
    </>
  );
}
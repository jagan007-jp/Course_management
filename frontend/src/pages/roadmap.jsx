import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import {
  Box,
  Flex,
  Button,
  Avatar,
  Container,
  Heading,
  Text,
  Stack,
  useToast,
  useColorModeValue,
  Input,
  color,
  textDecoration
} from "@chakra-ui/react";

function AIRoadmap() {
  const [result, setResult] = useState(null);
  const [subject, setSubject] = useState("");
  const toast = useToast();

  const generate = async () => {
    if (!subject) {
      toast({
        title: "Missing Subject",
        description: "Please enter a subject to generate the roadmap.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" mt={10} bg={useColorModeValue("white", "gray.700")} boxShadow="md" borderRadius="xl" p={6}>
      <Heading size="lg" mb={4} textAlign="center" color="blue.700">
        Roadmap Generator
      </Heading>
      <Stack spacing={4}>
        <Input
          placeholder="Enter the subject"
          maxLength={100}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          bg={useColorModeValue("gray.100", "gray.600")}
        />
        <Button colorScheme="blue" onClick={generate}>
          Generate Roadmap
        </Button>
      </Stack>
      {result && (
        <Box mt={8} bg={useColorModeValue("gray.50", "gray.800")} p={5} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={3}>
            The Roadmap for {subject}
          </Heading>
          <Box whiteSpace="pre-wrap" fontFamily="monospace" mb={4}>
            {result.text1}
          </Box>
          <a href={result.text2} target="_blank" style={{color:"darkblue", textDecoration:"underline"}}>
            Click here to start learning {subject}
          </a>
        </Box>
      )}
    </Container>
  );
}

export default function Roadmap() {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      <AIRoadmap />
    </Box>
  );
}

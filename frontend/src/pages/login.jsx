import { useState } from "react";
import { setUser, setError } from "../slice/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Container,
  useToast,
  Link,
  color,
} from "@chakra-ui/react";
import { useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    const user1 = username.trim()
    const pass1 = password.trim()
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username:user1, password:pass1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        toast({
          title: "Login Failed",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setUser(data.user));
        localStorage.setItem("username", data.user.username);
        toast({
          title: "Login Successful",
          description: `Welcome ${data.user.username}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/home");
      }
    } catch (err) {
      setError("Server Error");
      toast({
        title: "Server Error",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading textAlign="center" mb={6} color="blue.700">
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={error && username === ""}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
              />
            </FormControl>

            <FormControl isRequired isInvalid={error && password === ""}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                maxLength={14}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </FormControl>

            <Button colorScheme="blue" type="submit">
              Login
            </Button>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              New here?{" "}
              <Link as={RouterLink} to="/register" color="teal.500">
                Register
              </Link>
            </Text>

            {error && (
              <p style={{
                textAlign: "center",
                color: "red"
              }}>
                {error}
              </p>
            )}
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

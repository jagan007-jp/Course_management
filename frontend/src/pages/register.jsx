import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setError } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";

export default function Register() {
  const { user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    let flag = !/^[a-zA-Z_0-9]+$/.test(username);
    if(flag || username.trim()===""){
      toast({
        title:"Invalid username",
        description:"Username should not contain any special characters or be empty",
        status: "warning",
        duration:3000,
        isClosable:true
      })
      return;
    }
    if (password !== confirm) {
      dispatch(setError("Passwords don't match"));
      return;
    }
    try {
      const user1 = username.trim()
      const pass1 = password.trim()
      const res = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username:user1, password:pass1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(setError(data.message));
      } else {
        dispatch(setUser(data.user));
        toast({
          title: "Registration successful",
          description: "You can now log in",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (err) {
      dispatch(setError("Server Error"));
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="10" p="8" boxShadow="lg" borderRadius="lg">
      <Heading size="lg" mb="6" textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleRegister}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={5}
              maxLength={20}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={5}
              maxLength={14}
            />
          </FormControl>

          <FormControl isRequired isInvalid={password !== confirm && confirm !== ""}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={5}
              maxLength={14}
            />
            <FormErrorMessage>Passwords don't match</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" width="100%" type="submit">
            Register
          </Button>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Button onClick={() => navigate("/")} variant="link" colorScheme="blue">
            Back to Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

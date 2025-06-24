import {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  Button,
  Avatar,
  Heading,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState(''); 
  const navigate = useNavigate();
  const toast = useToast()
  useEffect(() => {
    if(user?.username){
        localStorage.setItem("username", user.username);
        setUsername(user.username);
    }else{
        const stored = localStorage.getItem("username");
        if (stored) setUsername(stored);
    }
  }, [user]);

  const onLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
    toast({
        title:"Logged Out",
        description: "Successfully logged out",
        status: "success",
        duration: 3000,
        isClosable: true
    })
  };

  return (
    <Box
      as="header"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="100"
      px={8}
      py={4}
    >
      <Flex align="center" justify="space-between">
        <Flex gap={4}>
          <Button variant="ghost" as="a" href="/home">
            Home
          </Button>
          <Button variant="ghost" as="a" href="/favourites">
            Favourites
          </Button>
          <Button variant="ghost" as="a" href="/roadmap">
            Learning Roadmap
          </Button>
        </Flex>
        <Heading size="md" color="blue.700" letterSpacing={1} position="absolute" left="50%" transform="translateX(-50%)">
          Simple Learning App
        </Heading>
        <Flex align="center" gap={3}>
          <Avatar
            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            name="profile"
            size="md"
          />
          {username && (
            <Text fontSize="sm" color="gray.600">
              {username}
            </Text>
          )}
          <Button colorScheme="red" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
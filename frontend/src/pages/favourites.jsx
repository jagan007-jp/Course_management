import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import {
  Box,
  Flex,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Image,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";

function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      alert("User not logged in");
      navigate("/");
    }
  }, [navigate, username]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/fav/get/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favourites");
        return res.json();
      })
      .then((data) => {
        setCourses(data.favCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [username]);

  if (loading)
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="lg" />
      </Flex>
    );

  if (error)
    return (
      <Container maxW="container.lg" mt={10}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container maxW="container.lg" mt={10}>
      <Heading size="lg" mb={4} textAlign="center" color="blue.700">
        Your Favourite Courses
      </Heading>

      {courses.length === 0 ? (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          You haven't added any courses yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {courses.map((course) => (
            <Box
              key={course.id}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="lg"
              borderRadius="xl"
              overflow="hidden"
              minH="420px"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{ transform: "scale(1.03)", boxShadow: "2xl" }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Image
                src={course.image}
                alt={course.title}
                height="300px"
                width="100%"
                objectFit="cover"
              />
              <Box p={5}>
                <Text fontWeight="bold" fontSize="xl" textAlign="center">
                  {course.title}
                </Text>
                <Flex mt={4} justify="center">
                  <Button
                    as="a"
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="blue"
                    variant="outline"
                  >
                    View Course
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}

export default function Favourites() {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      <CourseGrid />
    </Box>
  );
}

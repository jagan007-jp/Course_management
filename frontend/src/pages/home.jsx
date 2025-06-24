import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { CiStar } from "react-icons/ci";
import { MdOutlineStarOutline } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import {
  Box,
  Flex,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Skeleton,
  SkeletonText,
  Image,
  Stack,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [username, setUsername] = useState('');
  const limit = 6;
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setUsername(stored);
    } else {
      toast({
        title: "Not logged in",
        description: "Please login to continue",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    }
  }, [navigate, toast]);

  const fetchFavourites = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/fav/get/${username}`);
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Error occurred in server",
          description: data.message || "Could not load favourites",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return [];
      } else {
        return data.favCourses || [];
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return [];
    }
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const favs = await fetchFavourites();
      const favIds = new Set(favs.map(course => course.id));

      const offset = (page - 1) * limit;
      const res = await fetch(
        `http://localhost:5001/api/home/courses?limit=${limit}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();

      if (!data.courses || data.courses.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const updatedCourses = data.courses.map(course => ({
        ...course,
        isFavourite: favIds.has(course.id),
      }));

      setCourses(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newOnes = updatedCourses.filter(c => !existingIds.has(c.id));
        return [...prev, ...newOnes];
      });

      setLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }, [page, username]);

  useEffect(() => {
    if (!username) return;
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const handleFav = async (course) => {
    const isAdding = !course.isFavourite;
    try {
      const url = isAdding
        ? "http://localhost:5001/api/fav/add"
        : `http://localhost:5001/api/fav/${course.id}`;
      const method = isAdding ? "POST" : "DELETE";
      const body = isAdding
        ? JSON.stringify({ ...course, username })
        : JSON.stringify({ username });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await res.json();
      if (data.message) {
        toast({
          title: isAdding ? "Added to favourites" : "Removed from favourites",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setCourses(prev =>
          prev.map(c =>
            c.id === course.id ? { ...c, isFavourite: isAdding } : c
          )
        );
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update favourites",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading && courses.length === 0)
    return (
      <Container maxW="container.lg" mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Box
              key={idx}
              p={5}
              boxShadow="md"
              borderRadius="xl"
              bg="white"
              minH="300px"
            >
              <Skeleton height="180px" mb={4} />
              <SkeletonText noOfLines={4} spacing="4" />
            </Box>
          ))}
        </SimpleGrid>
      </Container>
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
        Available Courses
      </Heading>

      {courses.length === 0 ? (
        <Text textAlign="center" color="gray.500" fontSize="lg">
          No courses available right now.
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
              <Stack p={5} spacing={4} flex="1">
                <Text fontWeight="bold" fontSize="xl" textAlign="center">
                  {course.title}
                </Text>
                <Flex gap={3} mt="auto">
                  <Button
                    as="a"
                    href={course.link}
                    target="_blank"
                    colorScheme="blue"
                    variant="outline"
                    flex="1"
                  >
                    View Course
                  </Button>
                  <Button
                    colorScheme="green"
                    flex="1"
                    onClick={() => handleFav(course)}
                    fontSize="small"
                  >
                    {course.isFavourite ? (<MdOutlineStarPurple500 size={26}/>) : (<MdOutlineStarOutline size={26}/>)}
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {loading && (
        <Flex justify="center" mt={6}>
          <Spinner size="lg" />
        </Flex>
      )}
    </Container>
  );
}

export default function App() {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      <CourseGrid />
    </Box>
  );
}

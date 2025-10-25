/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const MotionText = motion(Text);

export function HeroSection() {
  const router = useRouter();

  return (
    <Box
      className="hero"
      position="relative"
      bgImage="url('https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgGradient: "linear(to-br, whiteAlpha.700, blue.50)",
        backdropFilter: "blur(3px)",
        zIndex: 0,
      }}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden">
      <Container
        maxW="5xl"
        py={{ base: 20, md: 28 }}
        position="relative"
        zIndex={1}>
        <VStack textAlign="center">
          <MotionText
            fontSize="sm"
            color="blue.500"
            fontWeight="semibold"
            letterSpacing="wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            POWERED BY AI
          </MotionText>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              color="gray.800"
              lineHeight={{ base: "short", md: "shorter" }}>
              Articless — Read Less, Know More.
            </Heading>
          </motion.div>

          <MotionText
            maxW="2xl"
            color="gray.600"
            fontSize={{ base: "md", md: "lg" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            py={10}>
            Articless helps you turn long articles into concise summaries.
            Simply paste a text or article link, and let our AI summarize it for
            you in seconds.
          </MotionText>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}>
            <Button
              onClick={() => {
                router.replace("/auth/register");
              }}
              colorScheme="blue"
              size="lg"
              px={10}>
              Get Started
            </Button>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* HERO SECTION */}
      <HeroSection />

      {/* FEATURES SECTION */}
      <Box bg="white" py={20}>
        <Container maxW="6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="semibold"
              textAlign="center"
              mb={12}
              color="gray.800">
              Why Choose Articless?
            </Heading>
          </motion.div>

          <SimpleGrid columns={{ base: 1, md: 3 }} className="flex gap-8">
            {[
              {
                title: "Smart Summarization",
                desc: "Powered by advanced AI models to extract the most relevant points.",
              },
              {
                title: "Multi-Source Support",
                desc: "Paste raw text or simply provide an article link — we handle both.",
              },
              {
                title: "Instant & Accurate",
                desc: "Get your summaries in seconds, with clean and accurate phrasing.",
              },
            ].map((feature, i) => (
              <Card.Root
                key={i}
                p={6}
                borderRadius="2xl"
                boxShadow="md"
                bg="white"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "lg",
                }}>
                <CardBody>
                  <VStack
                    align="start"
                    // spacing={3}
                  >
                    <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                      {feature.title}
                    </Text>
                    <Text color="gray.600">{feature.desc}</Text>
                  </VStack>
                </CardBody>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        py={6}
        textAlign="center"
        borderTop="1px solid"
        borderColor="gray.200">
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Articless. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}

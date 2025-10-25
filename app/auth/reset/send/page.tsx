"use client";

import {
  Box,
  Button,
  Card,
  Input,
  Stack,
  Text,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendReset, clearError } from "@/app/store/slices/auth";
import type { RootState, AppDispatch } from "@/app/store";
import { useEffect } from "react";
import { useAppToast } from "@/app/providers";
import { PublicGuard } from "@/app/guards/public";

type ForgotPasswordInputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, message } = useSelector(
    (state: RootState) => state.auth
  );
  const showToast = useAppToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();

  const onSubmit = (data: ForgotPasswordInputs) => {
    dispatch(sendReset({ email: data.email }));
  };

  // Toast error
  useEffect(() => {
    if (error) {
      showToast({
        title: "Error",
        description: message || error,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }, [error, message, showToast]);

  // Toast success
  useEffect(() => {
    if (success) {
      showToast({
        title: "Success",
        description: message || "Reset email sent successfully!",
        type: "success",
        duration: 4000,
        closable: true,
      });
    }
  }, [success, message, showToast]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <PublicGuard>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        bgImage="url('https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgRepeat="no-repeat">
        <Card.Root w="full" maxW="sm" variant="outline" boxShadow="md">
          <Card.Header textAlign="center" py={4}>
            <Image
              src="/logo.png"
              alt="Articless Logo"
              width={50}
              height={50}
              cursor="pointer"
            />
            <Text fontSize="2xl" fontWeight="bold">
              Forgot Password
            </Text>
            <Text mt={1} fontSize="sm" color="gray.500">
              Enter your email to receive a reset link
            </Text>
          </Card.Header>

          <Card.Body px={6} py={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                {/* EMAIL */}
                <Stack>
                  <Text fontSize="sm" fontWeight="medium">
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {errors.email && (
                    <Text fontSize="sm" color="red.500">
                      {errors.email.message}
                    </Text>
                  )}
                </Stack>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  colorScheme="blue"
                  w="full"
                  size="md"
                  disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Send Reset Link"}
                </Button>
              </Stack>
            </form>
          </Card.Body>

          <Card.Footer justifyContent="center" py={4}>
            <Text
              fontSize="sm"
              color="blue.600"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => (window.location.href = "/auth/login")}>
              Back to Login
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </PublicGuard>
  );
}

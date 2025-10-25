/* eslint-disable react/no-unescaped-entities */
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
import { login as loginUserThunk, clearError } from "@/app/store/slices/auth";
import type { RootState, AppDispatch } from "@/app/store";
import { useEffect } from "react";
import { useAppToast } from "@/app/providers";
import { PublicGuard } from "@/app/guards/public";
import { PasswordInput } from "@/components/ui/password-input";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, success, message } = useSelector(
    (state: RootState) => state.auth
  );

  const showToast = useAppToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    dispatch(loginUserThunk(data));
  };

  // Tampilkan toast error saat login gagal
  useEffect(() => {
    if (error) {
      showToast({
        title: "Error occured",
        description: message,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }, [error, showToast]);

  // Tampilkan toast sukses saat login berhasil
  useEffect(() => {
    if (success && user) {
      showToast({
        title: "Sucess",
        description: message,
        type: "success",
        duration: 4000,
        closable: true,
      });
    }
  }, [success, user, showToast]);

  // Clear error saat component unmount
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
              Login
            </Text>
            <Text mt={1} fontSize="sm" color="gray.500">
              Enter your email & password
            </Text>
          </Card.Header>

          <Card.Body px={6} py={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
              //  spacing={4}
              >
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

                {/* PASSWORD */}
                <Stack>
                  <Text fontSize="sm" fontWeight="medium">
                    Password
                  </Text>
                  <PasswordInput
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <Text fontSize="sm" color="red.500">
                      {errors.password.message}
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
                  {loading ? <Spinner size="sm" /> : "Sign In"}
                </Button>
              </Stack>
            </form>
          </Card.Body>

          <Card.Footer justifyContent="center" py={4} flexDirection="column">
            <Text
              fontSize="sm"
              color="blue.600"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              mb={2}
              onClick={() => {
                // Redirect ke halaman forgot password
                window.location.href = "/auth/reset/send";
              }}>
              Forgot your password?
            </Text>

            <Text fontSize="sm">
              Don't have an account?{" "}
              <Text
                as="span"
                color="blue.600"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => {
                  window.location.href = "/auth/register";
                }}>
                Sign up
              </Text>
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </PublicGuard>
  );
}

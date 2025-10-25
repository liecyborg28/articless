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
import {
  register as registerUserThunk,
  clearError,
} from "@/app/store/slices/auth";
import type { RootState, AppDispatch } from "@/app/store";
import { useEffect } from "react";
import { useAppToast } from "@/app/providers";
import { PublicGuard } from "@/app/guards/public";
import { PasswordInput } from "@/components/ui/password-input";

type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, success, message } = useSelector(
    (state: RootState) => state.auth
  );

  const showToast = useAppToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = (data: RegisterFormInputs) => {
    dispatch(registerUserThunk({ email: data.email, password: data.password }));
  };

  const password = watch("password");

  useEffect(() => {
    if (error) {
      showToast({
        title: "Error occured",
        description: message || error,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }, [error, message, showToast]);

  useEffect(() => {
    if (success) {
      showToast({
        title: "Success",
        description: message || "Account created successfully!",
        type: "success",
        duration: 4000,
        closable: true,
      });
    }
  }, [success, message, showToast]);

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
              Register
            </Text>
            <Text mt={1} fontSize="sm" color="gray.500">
              Create your account
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
                      minLength: {
                        value: 8,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <Text fontSize="sm" color="red.500">
                      {errors.password.message}
                    </Text>
                  )}
                </Stack>

                {/* CONFIRM PASSWORD */}
                <Stack>
                  <Text fontSize="sm" fontWeight="medium">
                    Confirm Password
                  </Text>
                  <PasswordInput
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <Text fontSize="sm" color="red.500">
                      {errors.confirmPassword.message}
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
                  {loading ? <Spinner size="sm" /> : "Sign Up"}
                </Button>
              </Stack>
            </form>
          </Card.Body>

          <Card.Footer
            flexDirection="column"
            alignItems="center"
            py={4}
            gap={2}>
            <Text fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Text
                onClick={() => {
                  window.location.href = "/auth/login";
                }}
                as="span"
                color="blue.600"
                fontWeight="medium"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}>
                Login
              </Text>
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </PublicGuard>
  );
}

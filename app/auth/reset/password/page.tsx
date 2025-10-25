"use client";

import {
  Box,
  Button,
  Card,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { resetPass, clearError, clearSuccess } from "@/app/store/slices/auth";
import type { AppDispatch, RootState } from "@/app/store";
import { useAppToast } from "@/app/providers";
import { PublicGuard } from "@/app/guards/public";

type ResetPasswordInputs = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showToast = useAppToast();

  const { loading, error, success, message } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const password = watch("password");
  const userId = searchParams.get("id");

  const onSubmit = (data: ResetPasswordInputs) => {
    if (!userId) {
      showToast({
        title: "Error",
        description: "Invalid or missing reset token.",
        type: "error",
      });
      return;
    }

    dispatch(
      resetPass({
        id: userId,
        password: data.password,
      })
    );
  };

  // 🔔 Toast for error
  useEffect(() => {
    if (error) {
      showToast({
        title: "Error",
        description: message || error,
        type: "error",
      });
    }
  }, [error, message, showToast]);

  // 🔔 Toast for success
  useEffect(() => {
    if (success) {
      showToast({
        title: "Success",
        description: message || "Password reset successfully!",
        type: "success",
      });

      // redirect setelah sukses
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  }, [success, message, router, showToast]);

  // Bersihkan state saat unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
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
        bgImage="url('https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0')"
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
              Reset Password
            </Text>
            <Text mt={1} fontSize="sm" color="gray.500">
              Enter your new password below
            </Text>
          </Card.Header>

          <Card.Body px={6} py={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                {/* NEW PASSWORD */}
                <Stack>
                  <Text fontSize="sm" fontWeight="medium">
                    New Password
                  </Text>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
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
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
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

                <Button
                  type="submit"
                  colorScheme="blue"
                  w="full"
                  size="md"
                  disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Reset Password"}
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
              onClick={() => router.push("/auth/login")}>
              Back to Login
            </Text>
          </Card.Footer>
        </Card.Root>
      </Box>
    </PublicGuard>
  );
}

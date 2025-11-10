/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import { signToken } from "@/app/utils/jwt";
import {
  LoginModel,
  RegisterModel,
  ResetPasswordModel,
} from "@/app/models/auth";
import { prisma } from "@/app/utils/prisma";
import { supabase } from "@/app/utils/supabase";
import { AppError } from "@/app/models/error";
import dotenv from "dotenv";

dotenv.config();

export async function register(model: RegisterModel) {
  const supabaseSignUp = {
    ...model,
    options: {
      emailRedirectTo: process.env.FE_URL,
    },
  };

  const { data, error }: any = await supabase.auth.signUp(supabaseSignUp);

  if (error) {
    const errorRes: AppError = {
      code: error.status,
      message: `${error}`,
    };

    throw errorRes;
  }

  const hashed = await bcrypt.hash(model?.password, 10);

  const payload: any = {
    ...model,
    email: data.user.email,
    password: hashed,
  };

  const existingUser = await prisma.user.findUnique({
    where: { email: data.user.email },
  });

  if (existingUser) {
    const errorRes: AppError = {
      code: 409,
      message: `User already registered! Please confirm your email before logging in.`,
    };

    throw errorRes;
  }

  const user = await prisma.user.create({ data: payload });

  return user;
}

export async function login(model: LoginModel) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: model.email,
    password: model.password,
  });

  if (error) {
    const errorRes: AppError = {
      code: error.status,
      message: `${error}`,
    };

    throw errorRes;
  }

  const existingUser = data.user;

  if (!existingUser?.email_confirmed_at) {
    const errorRes: AppError = {
      code: 403,
      message:
        "Email not verified. Please confirm your email before logging in.",
    };

    throw errorRes;
  }

  const user: any = await prisma.user.findUnique({
    where: { email: model?.email },
  });

  if (!user) {
    const errorRes: AppError = {
      code: 404,
      message:
        "User not found! Please check your login details before submitting",
    };

    throw errorRes;
  }

  const isMatch = await bcrypt.compare(model.password, user.password);
  if (!isMatch) throw new Error("Wrong password.");

  const token = signToken({ id: user?.id });
  return {
    user_id: user?.id,
    full_name: user?.full_name,
    email: user?.email,
    token,
  };
}

export async function resetPassword(model: ResetPasswordModel) {
  const { error } = await supabase.auth.updateUser({
    password: model.password,
  });

  if (error) {
    throw { code: 400, message: error.message };
  }

  const hashed = await bcrypt.hash(model?.password, 10);

  const user = await prisma.user.update({
    where: { id: model.id },
    data: { password: hashed },
  });

  const token = signToken({ id: model?.id });

  const resp = {
    user_id: user?.id,
    full_name: user?.full_name,
    email: user?.email,
    token,
  };

  return resp;
}

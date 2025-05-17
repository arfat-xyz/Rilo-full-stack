"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signupWithCreds(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw "Email already in use";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    // Automatically sign in the user after registration
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/products",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw "Invalid credentials.";
        default:
          throw "Something went wrong.";
      }
    }
    throw error;
  }
}

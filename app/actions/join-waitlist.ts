"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client/edge";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email");

  const result = schema.safeParse({ email });

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    await prisma.waitlist.create({
      data: {
        email: result.data.email,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Email already joined waitlist" };
      }
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

import z from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be less than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number."
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive hyphens"
    ),
});

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1, "Password cannot be empty"),
});

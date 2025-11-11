import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      error: "O email é inválido",
    })
    .trim()
    .toLowerCase()
    .min(1, "O email é inválido")
    .email("O email é inválido"),

  password: z
    .string({
      error: "A senha é inválida",
    })
    .min(1, "A senha é inválida"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
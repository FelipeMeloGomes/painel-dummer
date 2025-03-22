import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(5, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const emailSchema = z.object({
  email: z.string().min(5, "O email é obrigatório").email("Email inválido"),
});

export const signUpSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

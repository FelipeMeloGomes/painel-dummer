export function translateSupabaseError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "Credenciais inválidas. Verifique seu email e senha.",
    "User not found": "Usuário não encontrado.",
    "Email not confirmed":
      "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
  };

  return errorMap[message] || "Ocorreu um erro inesperado. Tente novamente.";
}

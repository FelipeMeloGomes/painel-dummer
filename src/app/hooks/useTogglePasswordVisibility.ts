import { useState } from "react";

export function useTogglePasswordVisibility() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  return { passwordVisible, togglePasswordVisibility };
}

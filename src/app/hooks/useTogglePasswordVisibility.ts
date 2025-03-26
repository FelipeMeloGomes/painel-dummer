import { useState } from "react";

function useTogglePasswordVisibility() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  return { passwordVisible, togglePasswordVisibility };
}

export default useTogglePasswordVisibility;

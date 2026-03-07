import { useState, useCallback } from "react";

/**
 * useToast – provides showToast(msg, type) and the current toast state.
 * type can be "success" | "warning" | "error"
 */
export function useToast(duration = 2500) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (msg, type = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  return { toast, showToast };
}

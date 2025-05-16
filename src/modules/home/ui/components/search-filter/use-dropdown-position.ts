import { RefObject, useEffect, useState, useCallback } from "react";

interface DropdownPosition {
  top: number;
  left: number;
}

export const useDropdownPosition = (ref: RefObject<HTMLDivElement>) => {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });

  const getDropdownPosition = useCallback((): DropdownPosition => {
    if (!ref.current) {
      return { top: 0, left: 0 };
    }

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Width of dropdown

    // Calculate initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Check if dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      // Align to right edge of button
      left = rect.right + window.scrollX - dropdownWidth;

      // If still off-screen, align to right edge of viewport with padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }

      // Ensure dropdown doesn't go off left edge
      if (left < 0) {
        left = 16;
      }
    }

    // Always return a position object
    return { top, left };
  }, [ref]);

  useEffect(() => {
    const updatePosition = () => {
      setPosition(getDropdownPosition());
    };

    updatePosition(); // Set initial position
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [getDropdownPosition]);

  return { position, getDropdownPosition };
};

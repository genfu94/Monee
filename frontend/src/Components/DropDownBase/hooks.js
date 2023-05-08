import React, { useState, useRef, useEffect } from "react";

export const useClickOut = (onClickOutside) => {
  const selectorContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectorContainerRef.current &&
        !selectorContainerRef.current.contains(event.target)
      ) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return [selectorContainerRef];
};

export const useDropdownInput = () => {
  const [open, setOpen] = useState(false);
  const [containerRef] = useClickOut(() => setOpen(false));

  const switchOpen = () => setOpen(!open);

  return [containerRef, open, switchOpen];
};

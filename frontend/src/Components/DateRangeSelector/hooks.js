import React, {useState} from "react";

export const useInput = () => {
  const [open, setOpen] = useState(false);
  const switchOpen = () => setOpen(!open);

  return [open, switchOpen];
} 


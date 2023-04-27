import React, { useState, useRef, useEffect } from "react";

import { Tree } from "./Tree";

const useOutsideClickClose = (onClickOutside) => {
  const selectorContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorContainerRef.current && !selectorContainerRef.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return [selectorContainerRef];
}

export const useSelectorButton = ({ data, defaultValue, onChange }) => {
  const tree = new Tree(data);

  const startNode = tree.find(defaultValue);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(defaultValue);
  const [value, setValue] = useState(startNode.attributes.label);
  const [node, setNode] = useState(startNode.parent);
  const [selectorContainerRef] = useOutsideClickClose(() => setOpen(false));

  const switchOpen = () => setOpen(!open);
  const setNodeByKey = (key) => {
    const currNode = tree.find(key);

    if (currNode.children.length === 0) {
      setKey(key);
      setValue(currNode.attributes.label);
      setOpen(false);
      onChange(key);
    } else {
      setNode(currNode);
    }
  };
  const goBack = () => setNode(node.parent);

  return [
    node,
    setNodeByKey,
    goBack,
    key,
    value,
    open,
    switchOpen,
    selectorContainerRef
  ];
};

export const useOptions = ({ node }) => {
  const isChild = node.key !== "_root_";
  const parentLabel = node.key === "_root_" ? "" : node.key;
  const options = node.children;

  return [isChild, parentLabel, options];
};

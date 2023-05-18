import React, { useState, useEffect } from "react";

import { Tree } from "./Tree";

export const useNestedNavigation = ({ data, defaultValue, handleClose, setLabel, onChange }) => {
  const tree = new Tree(data);

  const startNode = tree.find(defaultValue);
  
  useEffect(() => {
    setLabel(startNode.attributes.label);
  }, []);

  const [node, setNode] = useState(startNode.parent);

  const setNodeByKey = (key) => {
    const currNode = tree.find(key);
    if (currNode.children.length === 0) {
      handleClose();
      setLabel(currNode.attributes.label);
      onChange(currNode.key);
    } else {
      setNode(currNode);
    }
  };
  const goBack = () => setNode(node.parent);

  return [node, setNodeByKey, goBack];
};

export const useOptions = ({ node }) => {
  const isChild = node.key !== "_root_";
  const parentLabel = node.key === "_root_" ? "" : node.key;
  const options = node.children;

  return [isChild, parentLabel, options];
};

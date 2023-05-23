import React, { useState } from "react";

import { Tree } from "./Tree";

export const useNestedNavigation = ({ data, value, handleClose, onChange }) => {
  const tree = new Tree(data);
  console.log(tree);
  const [node, setNode] = useState(tree.find(value).parent);

  const setNodeByKey = (key) => {
    const currNode = tree.find(key);
    if (currNode.children === undefined || currNode.children.length === 0) {
      handleClose();
      onChange(currNode.key);
    } else {
      setNode(currNode);
    }
  };
  const goBack = () => setNode(node.parent);

  return [node, setNodeByKey, goBack];
};

export const useOptions = ({ node }) => {
  const isChild = node.value !== "_root_";
  const parentLabel = node.value === "_root_" ? "" : node.value;
  const options = node.children;

  return [isChild, parentLabel, options];
};

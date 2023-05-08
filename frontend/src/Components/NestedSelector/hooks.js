import React, { useState, useEffect } from "react";

import { Tree } from "./Tree";

export const useNestedNavigation = ({ data, defaultValue }) => {
  const tree = new Tree(data);

  const startNode = tree.find(defaultValue);
  const [node, setNode] = useState(startNode.parent);


  return [node, startNode.attributes.label, setNode, tree];
};

export const useOptions = ({ node, setNode, tree, updateLabel }) => {
  const isChild = node.key !== "_root_";
  const parentLabel = node.key === "_root_" ? "" : node.key;
  const options = node.children;
  updateLabel = updateLabel.updateLabel;

  const setNodeByKey = (key) => {
    const currNode = tree.find(key);
    if (currNode.children.length === 0) {
      updateLabel(currNode.attributes.label);
    } else {
      setNode(currNode);
    }
  };
  const goBack = () => setNode(node.parent);

  return [isChild, parentLabel, options, setNodeByKey, goBack];
};

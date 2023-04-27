class TreeNode {
  constructor(key, attributes={}, parent = null) {
    this.key = key;
    this.attributes = attributes;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }
}


export class Tree {
  constructor(dataTree) {
    this.root = new TreeNode("_root_");
    this.root.children = this._parseData(dataTree, this.root);
  }

  _parseData(dataTree, parent=this.root) {
    let nodes = [];
    for(const node of dataTree) {
      const newNode = new TreeNode(node.key, node.attributes, parent);

      if(node.children !== undefined && node.children.length > 0) {
        newNode.children = this._parseData(node.children, newNode);
      }

      nodes.push(newNode);
    }

    return nodes;
  }

  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  insert(key, parentNodeKey = null, attributes = {}) {
    if(parentNodeKey === null) {
      this.root = new TreeNode(key, attributes);
    }

    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, attributes, node));
        return true;
      }
    }
    
    return false;
  }

  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }

    return undefined;
  }
}
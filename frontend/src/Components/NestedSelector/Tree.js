export class Tree {
  constructor(dataTree) {
    this.root = {
      value: "__root__",
      parent: null
    }

    this.root.children = this._parseData(dataTree)
  }

  _parseData(dataTree, parent=this.root) {
    let nodes = [];
    for(const node of dataTree) {
      const newNode = {
        value: node.value,
        parent: parent,
        children: []
      };

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

  find(value) {
    for (let node of this.preOrderTraversal()) {
      if (node.value === value) return node;
    }

    return undefined;
  }
}
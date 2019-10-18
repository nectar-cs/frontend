
export default class Node{
  constructor(data, parent){
    this.title = data.friendly;
    this.parent = parent;
    this.outcome = null;
  }

  isLeaf(){ return !this.positive && !this.negative; }
  isRoot(){ return !this.parent; }
  wasProcessed(){ return !!this.outcome; }
  isCurrent(current){ return this == current; }

  static gulp(rawNode, parent=null){
    const node = new Node(rawNode, parent);
    node.positive = rawNode.positive && this.gulp(rawNode.positive, node);
    node.negative = rawNode.negative && this.gulp(rawNode.negative, node);
    return node;
  }
}
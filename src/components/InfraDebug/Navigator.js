
export default class Node{
  constructor(data, parent){
    this.title = data.friendly;
    this.parent = parent;
  }

  isCurrent(pointer){
    // noinspection EqualityComparisonWithCoercionJS
    return this == pointer;
  }

  isRoot(){
    return !this.parent;
  }

  static gulp(rawNode, parent=null){
    const node = new Node(rawNode, parent);

    if(rawNode.positive)
      node.positive = this.gulp(rawNode.positive, node);
    if(rawNode.negative)
      node.negative = this.gulp(rawNode.negative, node);

    return node;
  }
}
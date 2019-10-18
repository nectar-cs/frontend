
class Node{
  constructor(data){

  }
}

export default class Navigator{

  constructor(tree) {
    console.log("OLD TREE");
    console.log(tree);
    // this.tree = this.giveParents(tree);
    console.log("NEW TREE");
    console.log(this.tree);
  }

  giveParents(node, parent=null){
    node.parent = parent;
    if(node.positive)
      this.giveParents(node.positive, node);
    if(node.negative)
      this.giveParents(node.negative, node);
  }

  isOnPathToCurrent(key){
  }



}

export default class Node {
  constructor(data, depth, parent) {
    this._depth = depth;
    this._id = data.id;
    this._title = data.friendly;
    this.parent = parent;
    this.outcome = null;
  }

  id() {
    return this._id;
  }

  depth() {
    return this._depth;
  }

  title() {
    return this._title;
  }

  isLeaf() {
    return !this.positive && !this.negative;
  }

  isRoot() {
    return !this.parent;
  }

  wasProcessed() {
    return !!this.outcome;
  }

  isCurrent(current) {
    // noinspection EqualityComparisonWithCoercionJS
    // eslint-disable-next-line eqeqeq
    return this == current;
  }

  find(id) {
    if (this.id() === id) return this;
    const negResult = this.negative && this.negative.find(id);
    const posResult = this.positive && this.positive.find(id);
    if (negResult || posResult) return negResult || posResult;
    return null;
  }

  wasPositive() {
    return this.outcome === 'positive';
  }

  wasNegative() {
    return this.outcome === 'negative';
  }

  childForOutcome() {
    const outcome = this.outcome;
    if (outcome === 'positive') return this.positive;
    if (outcome === 'negative') return this.negative;
  }

  static gulp(rawNode, i = 0, parent = null) {
    if (!rawNode) return null;

    const node = new Node(rawNode, i, parent);
    node.positive = this.gulp(rawNode.positive, i + 1, node);
    node.negative = this.gulp(rawNode.negative, i + 1, node);
    return node;
  }
}

import Setter from "../../utils/StateGulp";

class BranchSetter extends Setter{
  sideEffects(bundle) {
    if(!bundle.isBranchLoaded(this._value)){
      bundle.fetchBranchCommits(this._value);
    }
  }
}


//@flow
import Setter from "../../utils/StateGulp";

class ApiSetter extends Setter {
  sideEffects(bundle: { [p: string]: * }): { [p: string]: * } {
    if(this._value === 'kubectl'){
      return {
        flavor: "json_jq",
        execName: "kubectl"
      }
    } else return null;
  }
}
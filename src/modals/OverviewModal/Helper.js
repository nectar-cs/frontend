import Kapi from "../../utils/Kapi";
import type {LabelMatrix} from "../../types/Types";
import type {MatrixBundle} from "./LabelsSection";

export default class Helper {

  static async fetchLabelMatrices(dep): Array<MatrixBundle> {
    const fetcher = this.fetchLabelMatrix;
    const depMatrix = await fetcher('deployment', dep.namespace, dep.name);
    const svcMatrices = dep.services.map(async service => {
      const matrix = await fetcher('deployment', dep.namespace, dep.name);
      return { type: "Service", name: service.name, matrix };
    });

    const depMatrixWrap = { type: "Deployment", name: dep.name, matrix: depMatrix };
    return [depMatrixWrap, ...svcMatrices];
  }

  static async fetchLabelMatrix(type, ns, name): LabelMatrix{
    const ep = "/api/cluster/label_matrix";
    const args = `matcher_type=${type}&matcher_ns=${ns}&matcher_name=${name}`;
    return await Kapi.bFetch(`${ep}?${args}`);
  }

}
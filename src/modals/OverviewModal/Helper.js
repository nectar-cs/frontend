import React, {Fragment} from 'react'
import Kapi from "../../utils/Kapi";
import type {LabelMatrix} from "../../types/Types";
import type {MatrixBundle} from "./LabelsSection";
import {Text} from "@nectar/js-common";

export default class Helper {

  static async fetchLabelMatrices(dep): Array<MatrixBundle> {
    const fetcher = this.fetchLabelMatrix;
    const depMatrix = await fetcher('deployment', dep.namespace, dep.name);
    const svcMatrices = await Promise.all(dep.services.map(async service => {
      const matrix = await fetcher('service', dep.namespace, dep.name);
      return { type: "Svc", name: service.name, matrix };
    }));

    const depMatrixWrap = { type: "Dep", name: dep.name, matrix: depMatrix };
    return [depMatrixWrap, ...svcMatrices];
  }

  static async fetchLabelMatrix(type, ns, name): LabelMatrix{
    const ep = "/api/cluster/label_matrix";
    const args = `matcher_type=${type}&matcher_ns=${ns}&matcher_name=${name}`;
    return await Kapi.bFetch(`${ep}?${args}`);
  }

  static async fetchLabelChecks(dep){
    const ep = `/api/deployments/${dep.namespace}/${dep.name}/validate_labels`;
    return await Kapi.bPost(ep, {})
  }

  static labelDictToHtml(titles, labels, hint){
    const lbsOffset = titles.length;
    const t = (n) => Array.from(Array(n).keys()).map(_ => (
      <Fragment>&nbsp;</Fragment>
    ));

    const lbs = Object.keys(labels).map(l => (
      <Text.Code raw>{t(lbsOffset)}{l}: {labels[l]}</Text.Code>
    ));

    const tits = titles.map((title, i) => (
      <Text.Code raw>{t(i)}{title}:</Text.Code>
    ));

    return(
      <Fragment>
        <Text.Code raw>#{hint}</Text.Code>
        <Text.Code raw>...</Text.Code>
        { tits }
        { lbs }
      </Fragment>
    )
  }
}

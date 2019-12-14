import React from 'react';
import ts from '../../assets/text-combos.sass';

export default function ColoredLabelList(props: Props) {
  const { labelType, labels } = props;
  const isWhiteList = labelType === 'whitelist';
  const labelClass = isWhiteList ? ts.whiteLabel : ts.blackLabel;

  return labels.map(labelCopy => (
    <p className={labelClass} key={labelCopy}>
      {labelCopy}
    </p>
  ));
}

type Props = {
  labelType: 'whitelist' | 'blacklist',
  labels: string[],
};

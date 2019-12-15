import React from 'react'
import {Text} from "ui-common";

export default function ColoredLabelList(props: Props) {
  const { labelType, labels } = props;
  const isWhiteList = labelType === 'whitelist';
  const emo = isWhiteList ? 'contrastFont' : 'primaryColor';

  return labels.map((labelCopy) => (
    <Text.StatusTag emotion={emo} key={labelCopy}>
      { labelCopy }
    </Text.StatusTag>
  ));
}

type Props = {
  labelType: 'whitelist' | 'blacklist',
  labels: string[]
}

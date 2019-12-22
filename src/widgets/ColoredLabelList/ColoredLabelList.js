//@flow
import React from 'react'
import {Text} from "@nectar/js-common";

export default function ColoredLabelList(props: Props) {
  const { labelType, labels } = props;
  const isWhiteList = labelType === 'whitelist';
  const emo = isWhiteList ? 'contentBackgroundColor' : 'primaryColor';

  return labels.map((labelCopy, i) => {
    const leftOffset = i === 0 ? 0 : 0.3;
    return(
      <Text.StatusTag emotion={emo} key={i} left={leftOffset}>
        {labelCopy}
      </Text.StatusTag>
    )
  });
}

type Props = {
  labelType: 'whitelist' | 'blacklist',
  labels: string[]
}

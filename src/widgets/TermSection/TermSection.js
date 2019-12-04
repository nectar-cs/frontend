import React, { Fragment, useEffect, useRef } from 'react';
import TextOverLineSubtitle from '../TextOverLineSubtitle/TextOverLineSubtitle';
import Layout from '../../assets/layouts';
import Text from '../../assets/text-combos';

export default function TermSection({ title, lines, extras = {} }) {
  const lineEndRef = useRef(null);

  const scrollToBottom = () => {
    lineEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom);

  const Lines = () =>
    lines.map((cmd, i) => (
      <Text.Code key={i} chill>
        {cmd}
      </Text.Code>
    ));

  return (
    <Fragment>
      <TextOverLineSubtitle text={title} />
      <Layout.BigCodeViewer {...extras}>
        <Lines />
        <div ref={lineEndRef} />
      </Layout.BigCodeViewer>
    </Fragment>
  );
}

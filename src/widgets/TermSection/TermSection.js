import React, {Fragment} from 'react'
import TextOverLineSubtitle from "../TextOverLineSubtitle/TextOverLineSubtitle";
import Layout from "../../assets/layouts";
import Text from "../../assets/text-combos";

export default function TermSection({title, lines}){

  const Lines = () => lines.map(cmd => (
    <Text.Code key={cmd} chill>{cmd}</Text.Code>
  ));

  return(
    <Fragment>
      <TextOverLineSubtitle text={title}/>
      <Layout.BigCodeViewer>
        <Lines/>
      </Layout.BigCodeViewer>
    </Fragment>
  )
}
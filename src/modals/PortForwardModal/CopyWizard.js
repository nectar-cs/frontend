import React, {useRef, Fragment} from 'react'
import PropTypes from 'prop-types'
import defaults from "./defaults";
import {Layout} from './../../assets/layouts'
import Text from './../../assets/text-combos'
import Button from './../../assets/buttons'

export default function CopyWizard(props){

  const ref = useRef(null);

  const apply = ()=> {
    // noinspection JSIgnoredPromiseFromCall
    navigator.clipboard.writeText(props.command);
  };

  const button = (
    <Button.SmallButton onClick={apply} >
      Copy to Clipboard
    </Button.SmallButton>
  );


  const follow = defaults.sectionTwo.lines(
    props.fromPort,
    props.toPort,
    <a href={defaults.sectionTwo.desktop}>Mosaic Desktop</a>
  );

  const followPs = follow.map(t => <Text.P key={t}>{t}</Text.P>);

  return(
    <Fragment>
      <p>{defaults.sectionTwo.instr}</p>
      <Layout.BigCodeViewer>
        <Text.Code ref={ref}>{props.command}</Text.Code>
      </Layout.BigCodeViewer>
      { button }
      { followPs }
    </Fragment>
  )
}

CopyWizard.propTypes = {
  command: PropTypes.string.isRequired,
  fromPort: PropTypes.any.isRequired,
  toPort: PropTypes.any.isRequired
};
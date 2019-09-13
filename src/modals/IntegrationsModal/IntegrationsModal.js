import React, {Fragment} from 'react'
import {LayoutIntro, ModalLayout} from "../../assets/layouts";
import LeftHeader from "../../widgets/LeftHeader/LeftHeader";
import MiscUtils from "../../utils/MiscUtils";
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import AddNew from "../../widgets/AddNew/AddNew";
import DockerSection from "./DockerSection";

export default class IntegrationsModal extends React.Component {

  render(){
    return(
      <ModalLayout>
        <LeftHeader
          graphicName={MiscUtils.image('integration.png')}
          title='Docker and Git Setup'
          subtitle='Integration portal'
          />

        <LayoutIntro>
          Mosaic is a lot more useful when it talks to your image and source repos.
        </LayoutIntro>

        <DockerSection/>
        { this.renderGitSection() }

      </ModalLayout>
    )
  }

  renderGitSection(){
    return(
      <Fragment>
        <TextOverLineSubtitle
          text='Git Integrations'
        />
        <AddNew><p>Add a GitHub or BitBucket account</p></AddNew>
      </Fragment>
    )
  }

}
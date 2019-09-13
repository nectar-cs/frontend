import React, {Fragment} from 'react'
import TextOverLineSubtitle from "../../widgets/TextOverLineSubtitle/TextOverLineSubtitle";
import AddNew from "../../widgets/AddNew/AddNew";

export default class GitSection extends React.PureComponent {
  render(){
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
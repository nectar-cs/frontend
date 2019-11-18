import React from "react";
import VertSection from "../../widgets/VertSection/VertSection";

export default function NotDoneSection({title}){
  return(
    <VertSection title={title} startExpanded={false}>
      <p>Soon</p>
    </VertSection>
  )
}
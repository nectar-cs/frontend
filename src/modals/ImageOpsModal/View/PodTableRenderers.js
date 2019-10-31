import PodTable from "./PodTable";
import React from "react";
import Text from "../../../assets/text-combos";

export function StdPodTable(props){
  return(
    <PodTable
      pods={props.pods}
      fields={['Name', 'State', 'Image']}
      mappers={[
        (p) => <p>{p.name}</p>,
        (p) => <Text.CleanStatus>{p.state}</Text.CleanStatus>,
        (p) => <p>{p.imageName}</p>,
      ]}
    />
  )
}

export function DesiredStatePodTable(props){
  return(
    <PodTable
      pods={props.pods}
      fields={['Name', 'State', 'Desired']}
      mappers={[
        (p) => <p>{p.name}</p>,
        (p) => <Text.CleanStatus>{p.state}</Text.CleanStatus>,
        (p) => <Text.CleanStatus>{p.desiredState}</Text.CleanStatus>,
      ]}
    />
  )
}

export function DesiredTagPodTable(props){
  return(
    <PodTable
      pods={props.pods}
      fields={['Name', 'Image', 'Desired']}
      mappers={[
        (p) => <p>{p.name}</p>,
        (p) => <p>{p.imageName}</p>,
        (p) => <p>{p.desiredImage}</p>,
      ]}
    />
  )
}
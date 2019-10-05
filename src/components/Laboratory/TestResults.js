import React, {Fragment} from 'react'
import {Layout} from './../../assets/layouts'
import TextOverLineTitle from "../../widgets/TextOverLineTitle/TextOverLineTitle";
import {StatusTag} from "../../assets/text-combos";
import {FROM_COUNT, TO_COUNT} from "./NetworkTest";
import faker from 'faker'

export default class TestResults extends React.Component {

  constructor(props){
    super(props);
    this.data = TestResults.makeData();
  }

  render(){
    return(
      <Layout.RightPanel>
        <TextOverLineTitle text='Results'/>
        { this.renderTable() }
      </Layout.RightPanel>
    )
  }

  renderTable(){
    return(
      <table>
        <tbody>
        <RowHeader/>
        { this.renderRows() }
        </tbody>
      </table>
    )
  }

  renderRows(){
    const max = Math.min(this.props.count, this.data.length);
    return Array.from(Array(max).keys()).map((i) => {
      const data = this.data[i];
      const emotion = data.success ? 'success' : 'fail';
      const word = data.success ? 'Passed' : 'Failed';
      return(
        <tr key={i}>
          <td><p>{data.from}</p></td>
          <td><p>{data.to}</p></td>
          <td><StatusTag emotion={emotion}>{word}</StatusTag></td>
        </tr>
      )
    });
  }

  static makeData(){
    const count = FROM_COUNT * TO_COUNT;
    return Array.from(Array(count).keys()).map(() => {
      const num = Math.random();
      return{
        from: faker.internet.ip(),
        to: faker.internet.ip(),
        success: num > 0.2
      }
    });

  }
}

function RowHeader(){
  return(
    <tr>
      <th><p>From</p></th>
      <th><p>To</p></th>
      <th><p>Result</p></th>
    </tr>
  )
}
import styled from 'styled-components'
import {Text} from "@nectar/js-common";

const EventsTimeline = styled.div`
  margin: -40px 0 0 ${p => p.far ? '-100px' :'-40px'};
  overflow-y: scroll;
`;

const DateContainer = styled.p`
  width: 100%;
  padding-top: 6px;
  text-align: center;
  font-weight: bold;
  &:hover{
    cursor: pointer;
  }
`;

const EventTitle = styled(Text.BoldStatus)`
  padding-top: 5px;
  &:hover{
    cursor: pointer;
  }
`;

const S = {
  EventsTimeline,
  EventTitle,
  DateContainer
};
export default S;

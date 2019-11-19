import styled from 'styled-components'
import Text from "../../assets/text-combos";

const TimelineStyles = {

};

const EventsTimeline = styled.div`
  margin: -40px 0 0 -100px
`;

const DateContainer = styled.p`
  width: 100%;
  padding-top: 6px;
  text-align: center;
  font-weight: bold;
`;

const EventTitle = styled(Text.BoldStatus)`
  padding-top: 5px;
`;

const S = {
  EventsTimeline,
  EventTitle,
  DateContainer
};
export default S;
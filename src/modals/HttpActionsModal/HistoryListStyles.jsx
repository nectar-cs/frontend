import styled from 'styled-components'
import {Text} from "@nectar/js-common";

const HistoryLabel = styled.p`
 display: block;
  &:hover{
    cursor: pointer
  }
`;

const HistoryToggleLine = styled.div`
  margin-top: 58px;
  display: inline-flex;
  justify-items: start;
`;

const Expand = styled.i`
  margin-top: -4px;
  margin-left: 4px;
  transform: rotate(90deg);
`;

const WholeRow = styled.tr`
  &:hover{
    background: ${p => p.theme.colors.contentBackgroundColor};
    cursor: pointer;,
}`;

const Url = styled.p`
  overflow: hidden;
  white-space: nowrap;
  width: 230px;
  text-overflow: ellipsis;
`;

const Verb = styled(Text.StatusTag)`
  width: 34px;
`;

const S = {
  HistoryLabel,
  HistoryToggleLine,
  Expand,
  WholeRow,
  Url,
  Verb
};

export default S;

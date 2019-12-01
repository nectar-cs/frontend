import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';

const TabsLayout = styled.div`
  margin-top: 20px;
  max-width: 100%;
  border-style: solid;
  border-width: 0 0 1px 0;
  overflow-x: scroll;
  white-space: nowrap;
`;

const Separator = styled.div`
  height: 30px;
`;

function animator(props) {
  return props.animate ? `1s ${keyframes`${bounce}`}` : 'none';
}

const Tab = styled.p`
  animation: ${props => animator(props)};
  display: inline-block;
  width: 100px;
  padding: 10px 14px 10px 14px;
  border-style: solid;
  border-width: 0 0 3px 0;
  text-align: center;
  border-color: ${p => (p.selected ? p.theme.colors.secondaryColor : 'transparent')};
  border-radius: 4px 4px 0 0;
  &:hover {
    border-color: ${p => (p.selected ? p.theme.colors.secondaryColor : 'transparent')};
    cursor: ${p => (p.selected ? 'default' : 'pointer')};
  }
`;

const S = {
  TabsLayout,
  Separator,
  Tab,
};

export default S;

import styled from 'styled-components';
import { colored } from '../../assets/constants';

const Container = styled.div`
  background: ${p => colored(p.emotion, p)};
  border-radius: 3px;
  padding: 5px 10px;
`;

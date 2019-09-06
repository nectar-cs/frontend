import styled from "styled-components";
import {TinySpinner} from "../../assets/loading-spinner";

export const List = styled.ul`
  margin-top: 30px;
  margin-left: 30px;
`;

export const Item = styled.div`
  display: flex;
  margin-top: 18px;
  align-items: center;
`;

export const Name = styled.p`
  width: 180px;
`;

export const Detail = styled.p`
  width: 20px;
  margin: 0;
`;

export const Icon = styled.div`
  margin-left: 24px;
  font-size: 21px;
  color: ${p => p.good ? p.theme.colors.success : p.theme.colors.warn }
`;

export const Spinner = styled(TinySpinner)`
  margin-left: 24px;
  transform: translateY(-3px);
`;
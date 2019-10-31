import styled from "styled-components";
import {ModSpinner} from "../../../assets/loading-spinner";
import {colored} from "../../../assets/constants";

export const List = styled.ul`
  margin-top: 15px;
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
  margin: 0 12px 0 0;
`;

export const Icon = styled.div`
  margin-left: 24px;
  font-size: 21px;
  color: ${p => colored(p.emotion, p)};
`;

export const Spinner = styled(ModSpinner)`
  margin-left: 24px;
  transform: translateY(-3px);
`;
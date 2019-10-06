import styled from "styled-components";

const RoundedForRow = styled.img`
  width: 21px;
  height: 21px;
  border-radius: 50%;
  margin-top: -2px;
  margin-right: ${p => p.push ? "12px" : '0'}
`;

const Img = { RoundedForRow };
export default Img;
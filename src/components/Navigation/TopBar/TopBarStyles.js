import styled from "styled-components";

const Container = styled.div`
  background: ${p => p.theme.colors.primaryColor};
  height: ${p => p.theme.dims.topBarHeight};
  margin-left: 12px;
  position: relative;
`;

const Search = styled.input`
  width: 400px;
  height: 70%;
  position: absolute;
  display: ${p => p.theme.dims.topBarHeight === "0px" ? "none" : "default"};
  left: 50%;
  top: 50%;
  background: white;
  margin: 0;
  padding: 0;
  transform: translateX(-50%) translateY(-50%);
`;

const S = { Container, Search };

export { S };
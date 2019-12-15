import styled from "styled-components";
import {Layout} from "ui-common";

const Editor = styled(Layout.BigCodeViewer)`
  margin-top: 0;
  width: calc(33.3% - 30px);
  padding-top: 12px;
  padding-bottom: 12px;
`;

const Editors = styled.div`
  width: 100%;
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
`;

const S = {Editors, Editor};

export default S;
import styled from 'styled-components'
import {Layout, Button} from "@nectar/js-common";

const Explanation = styled.ol`
  margin-top: 12px;
`;

const Conclusion = styled.ul`
  margin-top: 12px;
`;

const VerdictLine = styled(Layout.TextLine)`
  margin-top: 22px;
`;

const StartButton = styled(Button.SmallClearButton)`
  display: block;
  margin: 22px auto 0 auto;
`;

const NextButton = styled(Button.SmallClearButton)`
  margin-top: 2px;
`;

const S = { Explanation, VerdictLine, NextButton, StartButton, Conclusion };
export default S;

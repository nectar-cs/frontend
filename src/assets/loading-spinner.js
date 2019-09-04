import styled, {keyframes} from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &::after{
    content: " ";
    display: block;
    width: 26px;
    height: 26px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid ${p => p.theme.colors.primaryColor};
    border-color: ${p => p.theme.colors.primaryColor} transparent ${p => p.theme.colors.primaryColor} transparent;
    animation: ${rotate} 1.6s linear infinite;
  }
`;

export const TinySpinner = styled(LoadingSpinner)`
  width: 14px;
  height: 14px;
  &:after{
    width: 14px;
    height: 14px;
    border-width: 2px;
  }    
`;
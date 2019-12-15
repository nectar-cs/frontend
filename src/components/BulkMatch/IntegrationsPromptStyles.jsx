import styled from 'styled-components'

const containerSize = "370px";
const imageSize = "370px";
const iconSize = "70px";

const ConnectContainer = styled.div`
  position: relative;
  width: ${containerSize};
  height: ${containerSize};
  left: 50%;
  top: 45%;
  transform: translateX(-50%) translateY(-50%);
`;

const InnerBox = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const ContainerIcon = styled.i`
  display: block;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: ${iconSize};
  height: ${iconSize};
  font-size: ${iconSize};
  border-radius: 50%;
  color: ${p => p.theme.colors.primaryColor};
`;

const ContainerImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: ${imageSize};
  height: ${imageSize};
  background: transparent;
`;

const Text = styled.p`
  text-align: center;
  margin-top: 20px;
  &:first-child{
    margin-bottom: 18px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
`;

const Link = styled.a`
  background: transparent;
`;

const ContainerTextTitle = styled.p`
  margin-top: 20px;
  text-align: center;
`;

const ContainerTextSubtitle = styled.p`
  margin-top: 20px;
`;

const S = {
  ConnectContainer,
  InnerBox,
  Text,
  Buttons,
  Link,
  ContainerTextTitle,
  ContainerTextSubtitle,
  ContainerImage,
  ContainerIcon
};

export default S;
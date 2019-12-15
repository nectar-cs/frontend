import styled from 'styled-components'

const containerSize = "370px";
const iconSize = "110px";

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const Link = styled.a`
  background: transparent;
`;

const ContainerTextTitle = styled.p`
  margin-top: 20px;
  text-align: center;
`;

const ContainerText = styled.p`
  margin-top: 20px;
  text-align: center;
  max-width: 300px;
`;

const ClickableContainer = styled.div`
  composes: container;
  text-align: center;
  &:hover{
    cursor: pointer;
  }
`;

function bkgColor(p){
  if(p.light) return p.theme.colors.itemBackgroundColor;
  else return p.theme.colors.primaryColor
}

function textColor(p){
  if(p.light) return p.theme.colors.primaryColor;
  else return p.theme.colors.contrastColor;
}

const ContainerIcon = styled.i`
  display: block;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: ${iconSize};
  height: ${iconSize};
  font-size: ${iconSize};
  background: ${p => bkgColor(p)};
  border-radius: 50%;
  color: ${p => textColor(p)};
`;

const S = {
  Container,
  ContainerIcon,
  ContainerText,
  ContainerTextTitle,
  ClickableContainer,
  Link
};

export default S;
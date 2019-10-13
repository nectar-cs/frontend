import styled from 'styled-components'

const logoSide = "21px";

const arrow = (t) => ({
  color: t.colors.contrastColor,
  fontSize: "20px"
});

const sectionIcon = (t) => ({
  color: t.colors.contrastColor,
  margin: "0 12px 1.5px 0",
  fontSize: "22px"
});

const Sidebar = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  bottom: 0;
  background: ${p => p.theme.colors.primaryColor};
  width: ${p => p.theme.dims.sideBarWidth};
  height: 100%;

`;

const LogoBox = styled.div`
  width: 100%;
  margin-top: 12px;
  margin-left: 22px;
`;

const TitleLogo = styled.img`
  width: ${logoSide};
  height: ${logoSide}
`;

const TitleText = styled.h1`
  display: inline-block;
  font-size: 30px;
  letter-spacing: 2px;
  margin-left: 7px;
  color: ${p => p.theme.colors.contrastFont};
  text-transform: capitalize;
`;

const Content = styled.div`
  margin: 18px 0 0 22px;
`;

const SectionRow = styled.div`
  margin-top: 44px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  &:nth-child(1){
    margin-top: 10px;
  }
`;

const SectionTitle = styled.p`
  font-size: 15px;
  color: ${p => p.theme.colors.contrastColor}
`;

const SubSection = styled.div`
  margin-left: 19px;
  margin-top: 4px;
  display: block;
`;

const ItemRow = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const Item = styled.a`
  text-decoration: none;
  &:hover{
    text-decoration: underline
  }
`;

const ItemText = styled.p`
  margin-left: 4px;
  font-size: 13.5px;
  color: ${p => p.theme.colors.contrastColor};
  &:hover{
    cursor: pointer
  }
`;

const S = {
  Sidebar, LogoBox, TitleLogo, TitleText, Content,
  SectionRow, SectionTitle, SubSection, arrow,
  ItemRow, sectionIcon, Item, ItemText
};

export default S;
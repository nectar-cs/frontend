import styled from 'styled-components'
import {Text} from 'ui-common'

const logoSide = "21px";
const arrowSide = "20px";
const itemMargin = "4px";

const arrow = (t) => ({
  color: t.colors.contrastColor,
  fontSize: `${arrowSide}`,
  ":hover": {
    cursor: "pointer"
  }
});

const sectionIcon = (t) => ({
  color: t.colors.contrastColor,
  margin: "1px 12px 1.5px 0",
  fontSize: "20px"
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
  letter-spacing: 1.2px;
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

const ItemText = styled(Text.PA)`
  margin-left: ${itemMargin};
  font-size: 13.5px;
  font-weight: ${p => p.here ? 'bold' : 'normal'};
  color: ${p => p.theme.colors.contrastColor};
  &:hover{
    cursor: pointer
  }
`;

const SubItemsContainer = styled.ul`
  margin-top: -2px;
  margin-bottom: 6px;
`;

const SubItem = styled.li`
  color: ${p => p.theme.colors.contrastFont};
  margin-left: 2px;
`;

const SubItemText = styled(Text.PA)`
  color: ${p => p.theme.colors.contrastFont};
  font-weight: ${p => p.here ? 'bold' : 'normal'};
`;

const S = {
  Sidebar, LogoBox, TitleLogo, TitleText, Content,
  SectionRow, SectionTitle, SubSection, arrow,
  ItemRow, sectionIcon, ItemText,
  SubItemsContainer, SubItem, SubItemText
};

export default S;
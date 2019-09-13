import styled from "styled-components";
import {SmallButton} from "../../assets/buttons";

const less = (p) => p.theme.colors.contrastLessFont;
const primary = (p) => p.theme.colors.primaryColor;
const secondary = (p) => p.theme.colors.secondaryColor;

export const S = {

  RegistriesRow: styled.div`
    margin-top: 18px;
    display: flex;
  `,

  Vendor: styled.img`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    padding: 4px;
    border-color: ${p => secondary(p)};
    background: ${p => p.sel ? secondary(p) : 'transparent'};
    &:not(:first-child) {
     margin-left: 10px;
    }
    &:hover {
      cursor: pointer;
      background: ${p => p.sel ? secondary(p) : less(p)};  
    }
  `,

  FormButtonsRow: styled.div`
    margin-top: 22px;
    display: inline-flex;
    align-content: end;
    width: 150px;
    justify-content: space-between;
  `,

  CancelButton: styled(SmallButton)`
    margin: 0;
    background: ${p => less(p)};
  `,

  OkButton: styled(SmallButton)`
    margin: 0
  `,

  Apology: styled.p`
    margin-top: 16px
  `
};


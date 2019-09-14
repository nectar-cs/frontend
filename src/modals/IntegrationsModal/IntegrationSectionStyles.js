import styled from "styled-components";
import {SmallButton} from "../../assets/buttons";

const less = (p) => p.theme.colors.contrastLessFont;
const secondary = (p) => p.theme.colors.secondaryColor;

export const S = {

  RegistriesRow: styled.div`
    margin-top: 18px;
    display: flex;
  `,

  LoadingLayout: styled.div`
    width: 100%;
    height: 110px;
    position: relative;
  `,

  LoadText: styled.p`
    position: absolute;
    left: 50%;
    bottom: 0;
    margin-left: 2px;
    transform: translateX(-50%);
  `,

  Vendor: styled.img`
    width: 30px;
    height: 30px;
    border-radius: 9px;
    border-width: 2.2px;
    border-style: solid;
    padding: 4px;
    border-color: ${p => p.sel ? secondary(p) : 'transparent'};
    &:not(:first-child) {
     margin-left: 10px;
    }
    &:hover {
      cursor: pointer;
      border-color: ${p => secondary(p)};
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
    margin-top: 18px
  `,

  FwdNotice: styled.p`
    margin-top: 18px
  `
};


import styled from "styled-components";
import {SmallButton} from "../../assets/buttons";

export const S = {

  RegistriesRow: styled.div`
    margin-top: 18px;
    display: inline-flex;
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
    background: ${p => p.theme.colors.contrastLessFont};
  `,

  OkButton: styled(SmallButton)`
    margin: 0
  `,

  Apology: styled.p`
    margin-top: 16px
  `

};


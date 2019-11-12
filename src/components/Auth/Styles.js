import styled from "styled-components";

const Content = styled.div`
  height: 200px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const TitleBox = styled.div`
  display: block;
  margin: 0 auto 0 auto;
`;

const TitleText = styled.h1`
  font-size: 50px;
  display: inline-block;
  letter-spacing: 2.0px;
  margin-left: 8px;
  color: ${p => p.theme.colors.contrastFont};
  text-transform: uppercase;
`;

const FormBox = styled.div`
  margin: 26px 22px 0 22px;
`;

const RegisterLink = styled.p`
  margin: 18px 0 20px 0;
  text-align: center;
  color: ${p => p.theme.colors.contrastColor};
`;

const TitleLogo = styled.img`
  width: 36px;
  height: 36px;
`;

const ErrorBox = styled.ul`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
`;

const S = {
  Content,
  TitleBox,
  TitleText,
  FormBox,
  RegisterLink,
  TitleLogo,
  ErrorBox,
};

export default S;
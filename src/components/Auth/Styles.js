import styled from 'styled-components';
import Layout from '../../assets/layouts';

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
  letter-spacing: 2px;
  margin-left: 8px;
  color: ${p => p.theme.colors.contrastFont};
  text-transform: uppercase;
`;

const FormBox = styled.div`
  margin: 26px 22px 0 22px;
`;

const Options = styled.div`
  margin: 38px 0 20px 0;
  justify-content: center;
  text-align: center;
`;

const TitleLogo = styled.img`
  width: 36px;
  height: 36px;
`;

const S = {
  Content,
  TitleBox,
  TitleText,
  FormBox,
  Options,
  TitleLogo,
};

export default S;

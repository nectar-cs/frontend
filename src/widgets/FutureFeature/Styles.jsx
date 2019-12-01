import styled from 'styled-components';

const Title = styled.h2`
  margin: 20px 0 15px 0;
  text-align: center;
  font-weight: 900;
`;

const Subtitle = styled.p`
  margin: 20px 0 0 0;
  font-size: 15px;
  text-align: center;
`;

const PreviewImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  margin-top: 40px;
`;

const S = { Title, PreviewImage, Subtitle };

export default S;

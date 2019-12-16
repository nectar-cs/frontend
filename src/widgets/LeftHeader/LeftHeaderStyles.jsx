import styled from 'styled-components'

const headerHeight = "56px";

const Container = styled.div`
  padding: 0;
  margin: 0 0 8px 0;
  display: inline-flex;
  height: ${headerHeight};
`;

const Image = styled.img`
  object-fit: contain;
  width: ${headerHeight};
  height: ${headerHeight};
  max-height: ${headerHeight};
  max-width: ${headerHeight};
`;

const ImageStub = styled(Image)`
  border: none;
`;

const ImageBox = styled.div`
  height: 100%;
  margin: 2px 0 0 8px;
`;

const TextBox = styled.div`
  height: 100%;
  margin: 2px 0 0 8px;
`;

const Title = styled.h2`
  margin: 0;
  text-wrap: none;
`;

const SubTitle = styled.p`
  margin: 7px 0 0 0;
  display: inline-block;
  width: auto;
  color: ${p => p.theme.colors.primaryFontLess};
`;

const Icon = styled.i`
  width: ${headerHeight};
  height: ${headerHeight};
  font-size: ${headerHeight};
  color: ${p => p.theme.colors.primaryColor};
`;

const S = {
  Container,
  Image,
  ImageStub,
  ImageBox,
  Title,
  TextBox,
  SubTitle,
  Icon
};

export default S;
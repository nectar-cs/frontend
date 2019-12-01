import styled from 'styled-components';

const HorizontalBoxWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 12px;
`;

const HorizontalLine = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1.6px;
  background: ${p => p.theme.colors.primaryColor};
`;

const Title = styled.p`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  padding: 0 17px;
  margin-left: 34px;
  background: ${p => p.theme.colors.itemBackgroundColor};
  letter-spacing: 1px;
  font-weight: 800;
  text-transform: uppercase;
`;

const Toggle = styled.i`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  font-size: 30px;
  color: ${p => p.theme.colors.primaryColor};
  background: ${p => p.theme.colors.itemBackgroundColor};
  display: ${p => (p.there ? 'inline-block' : 'none')};
  &:hover {
    cursor: pointer;
  }
`;

const S = {
  HorizontalBoxWrapper,
  HorizontalLine,
  Title,
  Toggle,
};

export default S;

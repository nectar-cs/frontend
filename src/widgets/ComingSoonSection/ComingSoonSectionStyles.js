import styled from 'styled-components';

function sizer(p) {
  const size = p.size || 'medium';
  if (size === 'large') return 270;
  if (size === 'x-large') return 400;
  if (size === 'medium') return 200;
}

const Container = styled.div`
  display: flex;
  margin-top: 40px;
`;

const Words = styled.p`
  font-size: 15px;
  margin-top: 40px;
  text-align: center;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`;

const Icon = styled.img`
  color: pink;
  display: block;
  margin: 20px auto 60px auto;
  height: ${p => sizer(p)}px;
`;

const S = { Container, Icon, Words };

export default S;

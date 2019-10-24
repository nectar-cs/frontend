import styled from "styled-components";

function sizer(p){
  const size = p.size || 'medium';
  if(size === 'large') return 270;
  if(size === 'x-large') return 400;
  if(size === 'medium') return 200;
}

const Container = styled.div`
  display: flex;
  margin-top: 40px;
`;

const Text = styled.p`
  font-size: 17px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

const Icon = styled.img`
  color: pink;
  display: block;
  margin: 40px auto 0 auto;
  height: ${p => sizer(p)}px;
`;

const Title = styled.p`
  width: 100%;
  text-align: center;
  font-size: 17px;
  color: tomato;
  margin-top: 60px;
`;

const S = { Container, Icon, Title, Text };

export default S;
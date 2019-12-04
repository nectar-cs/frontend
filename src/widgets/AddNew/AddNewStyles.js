import styled from 'styled-components';

export const S = {
  Layout: styled.div`
    margin-top: 12px;
    display: inline-flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  `,

  Icon: styled.i`
    font-size: 20px;
    color: ${p => p.theme.colors.primaryColor};
    margin-right: 6px;
  `,
};

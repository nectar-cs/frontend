import React from 'react'
import styled from "styled-components";
import Micon from "../Micon/Micon";

export const Container = styled.div`
  width: 100%;
  border-width: 0 0 1px 0;
  border-style: solid;
  &:not(:nth-child(1)) {
    margin-left: 18px;
  }
`;

export const InputWrapper = styled('div')`
  width: 100%;
  border-color: ${p => p.theme.colors.primaryColor};
  display: inline-flex;
  flex-wrap: wrap;

  & input {
    padding: 0;
    margin-top: 0;
    line-height: 26px;
    flex-grow: 1;
    border: 0;
    outline: 0;
  }
`;

export const Listbox = styled('ul')`
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;







export const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <p>{label}</p>
    <Micon onClick={onDelete} n='close' size='xs' left={0.4}/>
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

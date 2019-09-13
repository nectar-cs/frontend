import React from 'react'
import PropTypes from 'prop-types'
import { S } from './AddNewStyles'
import {ThemeProvider} from "styled-components";
import {theme} from "../../assets/constants";

export default function AddNew(props){
  return(
    <ThemeProvider theme={theme}>
      <S.Layout onClick={props.action}>
        <S.Icon className='material-icons'>add_circle_outline</S.Icon>
        { props.children }
      </S.Layout>
    </ThemeProvider>
  )
}

AddNew.propTypes = {
  action: PropTypes.any.isRequired
};
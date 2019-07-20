import React from 'react';
import styles from './../assets/input-combos.sass'

const FancyButton = ({label}) => (
    <button className={styles.formSubmitContrast}>{label}</button>
);

export default FancyButton;

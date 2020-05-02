import React from 'react';
import { css } from '@emotion/core';
import notVisible from '../assets/images/test.jpg';
import getPath from '../utils/pathUtils';

export default function Card(props) {
  const {
    visible = true,
    card
  } = props;
  return (
    <div
      css={css`
        width: 100px;
        height: 150px;
        background-color: #eab000;
        border-radius: 15px;
        margin: 5px;
      `}
    >
      <img
        src={visible ? getPath(card.path) : notVisible}
        alt="card"
      />
    </div>
  );
}

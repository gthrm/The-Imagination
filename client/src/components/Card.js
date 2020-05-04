import React from 'react';
import { css } from '@emotion/core';
import notVisible from '../assets/images/test.jpg';
import getPath from '../utils/pathUtils';

export default function Card(props) {
  const {
    visible = true,
    card,
    selectCardApi
  } = props;
  const onPress = () => selectCardApi({ card });
  return (
    <div
      onKeyPress={onPress}
      role="button"
      tabIndex="0"
      onClick={onPress}
      css={css`
        width: 100px;
        height: 150px;
        border: ${card?.selected ? 'solid var(--textLink) 3px' : 'solid var(--textLink) 0px'};
        background-color: #eab000;
        border-radius: 15px;
        margin: 5px;
        overflow: hidden;
        transition-duration: 0.2s;
        transition-property: all;
      `}
    >
      <img
        src={visible ? getPath(card.path) : notVisible}
        alt="card"
      />
    </div>
  );
}

import React from 'react';
import { css } from '@emotion/core';
import getPath from '../utils/pathUtils';

export default function Card(props) {
  const {
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
        background-image: linear-gradient(225deg,#ffffff80,#ffffff1c);
        border-radius: 15px;
        margin: 5px;
        overflow: hidden;
        transition-duration: 0.2s;
        transition-property: all;
        position: relative;
        box-shadow: 0 3px 9px #0000003d, inset 0 0 9px #ffffff29;
      `}
    >
      {!card?.hidden
        && (
        <img
          src={getPath(card.path)}
          alt="card"
        />
        )}

    </div>
  );
}

import React from 'react';
import { css } from '@emotion/core';

export default function NumberOfCard(props) {
  const {
    index,
    position = 'absolute',
    size = 30,
    onPress = () => { },
    selected
  } = props;
  return (
    <p
      onClick={onPress}
      onKeyPress={onPress}
      role="presentation"
      css={css`
        font-size: ${size / 2}px;
        text-align: center;
        position: ${position};
        right: -8px;
        top: -8px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(0,0,0,0.59);
        line-height: ${size}px;
        border: ${selected ? '2px solid var(--tbg)' : '1px solid'};
        color: ${selected ? 'var(--tc)' : '#bbadd9'};
        user-select: none;
        
      `}
    >
      {index}
    </p>
  );
}

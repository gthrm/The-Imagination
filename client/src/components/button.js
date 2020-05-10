import React, { useState } from 'react';
import { css } from '@emotion/core';

export default function Button(props) {
  const {
    onClick = () => { },
    title
  } = props;
  const [isPressed, setPress] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onKeyDown={(event) => (event.key === 'Enter' ? setPress(true) : () => { })}
      onKeyUp={(event) => (event.key === 'Enter' ? setPress(false) : () => { })}
      onKeyPress={(event) => (event.key === 'Enter' ? onClick() : () => { })}
      role="button"
      tabIndex="0"
      css={css`
            min-width: 200px;
            border-color: #382e59 #2e2640;
            border-radius: 2px;
            border-style: solid;
            border-width: 3px 5px 8px 5px;
            color: #bbadd9;
            display: block;
            font-family: sans-serif;
            font-size: 9px;
            font-weight: 800;
            grid-column-end: span 2;
            margin: 3px;
            padding-top: 2px;
            padding: 5px;
            text-align: center;
            text-transform: uppercase;
            transition: all 50ms ease-out;
            will-change: box-shadow, color, text-shadow;
            user-select: none;
            ${isPressed && `
              transform: perspective(1200px) translateZ(-30px);
            `}
            &:hover { cursor: pointer; }
      `}
    >
      {title}
    </div>
  );
}


import React, { useState } from 'react';
import { css } from '@emotion/core';
import getPath from '../utils/pathUtils';
import useLongPress from '../hooks/useLongPress';
import useWindowSize from '../hooks/useWindowSize';
import disableLongPress from '../utils/disableLongPress';
import NumberOfCard from './NumberOfCard';
import VotedPlayers from './VotedPlayers';

export default function Card(props) {
  const {
    card,
    showTrue,
    selectCardApi,
    index,
    votingStarted,
    nextRoundIsAvailable
  } = props;

  const [fullSizeImg, setFullSizeImg] = useState(false);
  const onPress = () => {
    selectCardApi({ card });
    setFullSizeImg(false);
  };

  const callback = () => setFullSizeImg(true);
  const longPress = useLongPress(callback, 500);


  const { width } = useWindowSize();

  return (
    <div
      key={card.fileName}
      css={css`
      position: ${fullSizeImg ? 'absolute' : 'relative'};
      z-index: ${fullSizeImg ? 999 : 'inherit'};
      padding: 0 10px;
      user-select: none;
      -webkit-touch-callout: none;
    `}
    >
      <div
        {...longPress}
        onKeyPress={onPress}
        role="button"
        tabIndex="0"
        onClick={onPress}
        css={css`
        width: ${fullSizeImg ? `${width - 40}px` : '100px'};
        height: ${fullSizeImg ? 'auto' : '150px'};
        border: ${card?.selected || showTrue ? `solid var(${showTrue && card?.isTurn ? '--greenBorder' : '--textLink'}) 3px` : 'solid var(--textLink) 0px'};
        background-image: linear-gradient(225deg,#ffffff80,#ffffff1c);
        border-radius: 15px;
        margin: 5px;
        overflow: hidden;
        transition-duration: 0.2s;
        transition-property: all;
        position: relative;
        box-shadow: 0 3px 9px #0000003d, inset 0 0 9px #ffffff29;
        user-select: none;
        -webkit-touch-callout: none;
      `}
      >
        {!card?.hidden
          && (
            <img
              css={css`
              user-select: none;
              -webkit-touch-callout: none;
            `}
              {...disableLongPress}
              src={getPath(card.path)}
              alt="card"
            />
          )}

      </div>
      {!!votingStarted && <NumberOfCard index={index} />}
      {nextRoundIsAvailable && <VotedPlayers votedPlayers={card.votedPlayers} />}
    </div>
  );
}

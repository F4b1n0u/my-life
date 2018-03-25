import React from 'react'
import { View, LayoutAnimation } from 'react-native'
import styled from 'styled-components/native'
import { arrayOf, func, number, object } from 'prop-types'
import { BlurView } from 'expo'

import PlayerComponent from '#components/player'

import { COLORS } from '#modules/player/color/value'

import { colorToImage } from '#utils/color'

export default class PlayerListComponent extends React.Component {
  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  render() {
    const {
      playerList,
      opponentMap,
      style,
      changePlayerStatus,
      changePlayerColor,
      changePlayerLife,
      togglePlayerIsPoisonActive,
      attack,
      heal,
      restartGame,
    } = this.props

    return (
      <View
        style={style}
      >
        {playerList.map((player, index) => (
          <Panel
            key={`panel.${player.id}`}
            location={index}
          >
            <ColorBlur color={player.color.value}>
              <PlayerColor
                // the key is to ensure the smooth transition
                key={player.color.value}
                color={player.color.value}
              />
              <Player
                // TODO the mapping with player ID should be here !!
                {...player}
                opponents={opponentMap[player.id]}
                changePlayerStatus={changePlayerStatus}
                changePlayerColor={changePlayerColor}
                changePlayerLife={changePlayerLife}
                togglePlayerIsPoisonActive={togglePlayerIsPoisonActive}
                attack={attack}
                heal={heal}
                restartGame={restartGame}
              />
            </ColorBlur>
          </Panel>
         ))}
      </View>
    )
  }
}
  // ${({ location }) => location === 0 && 'transform: rotate(180deg);'};

PlayerListComponent.propTypes = {
  playerList: arrayOf(object).isRequired,
  opponentMap: object.isRequired,
  style: arrayOf(number).isRequired,
  attack: func.isRequired,
  heal: func.isRequired,
  changePlayerStatus: func.isRequired,
  togglePlayerIsPoisonActive: func.isRequired,
}

const Panel = styled.View`
  flex: 1;

  margin-vertical: 10;
  margin-horizontal: 10;
  border-radius: 20;
  border-width: 1;
  border-color: #ffffff;
  
`

const PlayerColor = styled.Image
  .attrs({
    source: ({ color }) => colorToImage(color),
  })`
    position: absolute;
  border-radius: 20;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  `

const ColorBlur = styled(BlurView)
  .attrs({
    intensity: 80,
    tint: ({ color }) => color ? undefined : 'dark',
  })`
  position: absolute;
  border-radius: 20;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Player = styled(PlayerComponent)`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 20;
`

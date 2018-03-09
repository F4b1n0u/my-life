import React from 'react'
import { LayoutAnimation } from 'react-native'
import styled from 'styled-components/native'
import { arrayOf, func, number, object, string } from 'prop-types'

import PlayerSettingComponent from '#components/player-setting'
import BattlefieldComponent from '#components/battlefield'
import OutcomeComponent from '#components/outcome'

import { STATUSES as PLAYER_STATUSES } from '#modules/player/status'

export default class PlayerComponent extends React.Component {
  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  render() {
    const {
      id,
      color,
      life,
      status,
      poison,
      opponents,
      changePlayerStatus,
      changePlayerColor,
      changePlayerLife,
      togglePlayerIsPoisonActive,
      attack,
      heal,
      restartGame,
    } = this.props

    let element = null

    switch (status) {
      case PLAYER_STATUSES.FIGTHING:
        element = (
          <Battlefield
            life={life.value}
            color={color.value}
            attack={attack(opponents[0].id)}
            heal={heal(id)}
          />
        )
        break
      case PLAYER_STATUSES.DONE:
        element = (
          <Outcome
            life={life.value}
            onRestart={restartGame}
          />
        )
        break
      default:
        // PLAYER_STATUSES.SELECTING_COLOR
        // PLAYER_STATUSES.SELECTING_LIFE
        // PLAYER_STATUSES.READY_TO_FIGHT
        element = (
          <PlayerSetting
            status={status}
            color={color.value}
            life={life.value}
            poison={poison}
            changePlayerStatus={changePlayerStatus(id)}
            changePlayerColor={changePlayerColor(id)}
            changePlayerLife={changePlayerLife(id)}
            togglePlayerIsPoisonActive={togglePlayerIsPoisonActive(id)}
          />
        )
        break
    }

    return element
  }
}

PlayerComponent.propTypes = {
  id: number.isRequired,
  life: object.isRequired,
  color: object.isRequired,
  status: string.isRequired,
  opponents: arrayOf(object).isRequired,
  attack: func.isRequired,
  heal: func.isRequired,
  changePlayerStatus: func.isRequired,
  changePlayerColor: func.isRequired,
  changePlayerLife: func.isRequired,
}

const Battlefield = styled(BattlefieldComponent)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const PlayerSetting = styled(PlayerSettingComponent)`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`

const Outcome = styled(OutcomeComponent)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

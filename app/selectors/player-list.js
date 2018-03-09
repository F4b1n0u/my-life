import { differenceWith } from 'lodash'

import { STATE_KEY as PLAYER_LIST_KEY } from '#modules/player-list'
import { STATUSES as PLAYER_STATUSES } from '#modules/player/status'

const arePlayerWithSameId = ({ id: idA }, { id: idB }) => idA === idB

export const getPlayer = (state, id) => state[PLAYER_LIST_KEY].entities.byId[id]

export const getPlayerList = state => Object.values(state[PLAYER_LIST_KEY].entities.byId)

export const getFightingPlayerList = state => getPlayerList(state)
  .filter(({ status }) => status === PLAYER_STATUSES.FIGTHING)

export const getReadyToFightPlayerList = state => getPlayerList(state)
  .filter(({ status }) => status === PLAYER_STATUSES.READY_TO_FIGHT)

export const getSettingUpPlayerList = state => getPlayerList(state)
  .filter(({ status }) => [
    PLAYER_STATUSES.SELECTING_COLOR,
    PLAYER_STATUSES.SELECTING_LIFE,
    PLAYER_STATUSES.READY_TO_FIGHT,
  ].includes(status))

export const getOpponentMap = (state) => {
  const playerList = getPlayerList(state)
  return playerList.reduce(
    (acc, { id }) => {
      const opponents = differenceWith(playerList, [{ id }], arePlayerWithSameId)
      acc[id] = opponents
      return acc
    },
    {}
  )
}

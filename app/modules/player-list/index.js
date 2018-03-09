import 'rxjs'

import { combineReducers } from 'redux'
import { Observable } from 'rxjs/Observable'
import { combineEpics } from 'redux-observable'
import _ from 'lodash'

import playerReducer, {
  ATTACK as ATTACK_PLAYER,
  HEAL as HEAL_PLAYER,
  attack,
  heal,
  epic as playerEpic,
} from '#modules/player'

import {
  CHANGE as CHANGE_PLAYER_LIFE,
  DECREASE as DECREASE_PLAYER_LIFE,
  change as changeLife,
  increase as increaseLife,
  decrease as decreaseLife,
} from '#modules/player/life/value'

import {
  STATUSES as PLAYER_STATUSES,
  CHANGE as CHANGE_PLAYER_STATUS,
  change as changeStatus,
} from '#modules/player/status'

import {
  CHANGE as CHANGE_PLAYER_COLOR,
  change as changeColor,
} from '#modules/player/color/value'

import {
  toggle as toggleIsActive,
} from '#modules/player/poison/is-active'

import {
  getPlayer,
  getFightingPlayerList,
  getSettingUpPlayerList,
  getReadyToFightPlayerList,
} from '#selectors/player-list'

import {
  playerTap,
  // playerMagicFireball,
  // playerWhooshWoow,
  playerVictory,
} from '#utils/audio'


import { STATUSES } from '../player/status'
import { getPlayerList } from '../../selectors/player-list'

const DEBOUNCE_DURATION = 500

// state key
export const STATE_KEY = 'player-list'


// State
export const initialState = {
  entities: {
    [STATE_KEY]: {
      byId: {},
      allIds: [],
    },
  },
}

// Actions
export const ADD = `my-games/${STATE_KEY}/ADD`
export const RESTART = `my-games/${STATE_KEY}/RESTART`

// Action Creators
export const add = player => ({
  type: ADD,
  payload: player,
})

export const restart = () => ({
  type: RESTART,
})

export const changePlayerStatus = (playerId, status) => ({
  ...changeStatus(status),
  meta: {
    playerId,
  },
})

export const changePlayerColor = (playerId, color) => ({
  ...changeColor(color),
  meta: {
    playerId,
  },
})

export const changePlayerLife = (playerId, life) => ({
  ...changeLife(life),
  meta: {
    playerId,
  },
})

export const increasePlayerLife = (playerId, step = 1) => ({
  ...increaseLife(step),
  meta: {
    playerId,
  },
})

export const decreasePlayerLife = (playerId, step = 1) => ({
  ...decreaseLife(step),
  meta: {
    playerId,
  },
})

export const attackPlayer = (playerId, damage = 1) => ({
  ...attack(damage),
  meta: {
    playerId,
  },
})

export const healPlayer = (playerId, healing = 1) => ({
  ...heal(healing),
  meta: {
    playerId,
  },
})

export const togglePlayerIsPoisonActive = playerId => ({
  ...toggleIsActive(),
  meta: {
    playerId,
  },
})

// Reducers
function byIdReducer(
  state = initialState.entities[STATE_KEY].byId,
  action
) {
  const {
    type,
    payload = {},
    meta = {},
  } = action

  const nextState = _.extend({}, state)

  switch (type) {
    case ADD: {
      const {
        id,
      } = payload

      _.extend(nextState, {
        [id]: playerReducer({}, action),
      })

      break
    }
    default: {
      const players = Object.values(nextState)
      const targertedPlayers = meta.playerId ?
        players.filter(({ id }) => id === meta.playerId) :
        players

      targertedPlayers
        .forEach((player) => {
          _.extend(nextState, {
            [player.id]: playerReducer(player, action),
          })
        })
      break
    }
  }

  return nextState
}

function allIdsReducer(
  state = initialState.entities[STATE_KEY].allIds,
  {
    type,
    payload = {},
  }
) {
  switch (type) {
    case ADD: {
      const {
        id,
      } = payload
      return _.uniq(_.concat(state, id))
    }
    default:
      return state
  }
}

export const entitiesReducer = combineReducers({
  byId: byIdReducer,
  allIds: allIdsReducer,
})

export default combineReducers({
  entities: entitiesReducer,
})

// Action Creators


// Epics
const decreasePlayerLifeToStatusDoneEpic = (action$, { getState }) => action$
  .ofType(DECREASE_PLAYER_LIFE)
  .mergeMap(({ meta }) => {
    let action = Observable.empty()

    const playerId = meta.playerId || ''
    const state = getState()
    const player = getPlayer(state, playerId)

    if (player.life.value < 1) {
      action = Observable.of(changePlayerStatus(playerId, STATUSES.DONE))
    }

    return action
  })

const changePlayerStatusToStatusDoneEpic = (action$, { getState }) => action$
  .ofType(CHANGE_PLAYER_STATUS)
  .mergeMap(() => {
    let action = Observable.empty()

    const state = getState()
    const fightingPlayerList = getFightingPlayerList(state)
    // could do a dynamic observable instead of that ...
    // like you merge only once all the player are fighting
    const settingUpPlayerList = getSettingUpPlayerList(state)

    const countSettingUpPlayers = settingUpPlayerList.length
    const countFightingPlayers = fightingPlayerList.length

    if (
      countSettingUpPlayers < 1 &&
      countFightingPlayers > 0 &&
      countFightingPlayers < 2
    ) { // rest only one survivor while there is no fight
      playerVictory.playAsync()
      const survivor = fightingPlayerList[0]
      action = Observable.of(changePlayerStatus(survivor.id, STATUSES.DONE))
    }

    return action
  })

const defaultDecreaseLifeOptions = {
  damage: 0,
  playerId: undefined,
}

const decreasePlayerLifeToAggregateEpic = (action$) => {
  let decreaseLifeOptions = {
    ...defaultDecreaseLifeOptions,
  }

  const decreaseAction$ = action$
    .ofType(ATTACK_PLAYER)
    .map(({ payload: { damage }, meta: { playerId } }) => ({
      damage,
      playerId,
    }))

  const debounceDecreaseAction$ = action$
    .ofType(ATTACK_PLAYER)
    .debounceTime(DEBOUNCE_DURATION)

  const cumulDamage$ = decreaseAction$
    .map(({ damage, playerId }) => {
      decreaseLifeOptions.playerId = playerId
      decreaseLifeOptions.damage += damage
      return decreaseLifeOptions
    })

  // TODO there is for sure a better way to do that ...
  return Observable
    .zip(
      cumulDamage$,
      debounceDecreaseAction$,
      () => decreaseLifeOptions
    )
    .mergeMap(() => {
      const {
        playerId,
        damage,
      } = decreaseLifeOptions

      decreaseLifeOptions = {
        ...defaultDecreaseLifeOptions,
      }
      return Observable.of(decreasePlayerLife(playerId, damage))
    })
}

const defaultIncreaseLifeOptions = {
  healing: 0,
  playerId: undefined,
}

const increasePlayerLifeToAggregateEpic = (action$) => {
  let increaseLifeOptions = {
    ...defaultIncreaseLifeOptions,
  }

  const increaseAction$ = action$
    .ofType(HEAL_PLAYER)
    .map(({ payload: { healing }, meta: { playerId } }) => ({
      healing,
      playerId,
    }))

  const debounceDecreaseAction$ = action$
    .ofType(HEAL_PLAYER)
    .debounceTime(DEBOUNCE_DURATION)

  const cumulCare$ = increaseAction$
    .map(({ healing, playerId }) => {
      increaseLifeOptions.playerId = playerId
      increaseLifeOptions.healing += healing
      return increaseLifeOptions
    })

  // TODO there is for sure a better way to do that ...
  return Observable
    .zip(
      cumulCare$,
      debounceDecreaseAction$,
      () => increaseLifeOptions
    )
    .mergeMap(() => {
      const {
        playerId,
        healing,
      } = increaseLifeOptions

      increaseLifeOptions = {
        ...defaultIncreaseLifeOptions,
      }
      return Observable.of(increasePlayerLife(playerId, healing))
    })
}

const changePlayerStatusToSoundEpic = action$ => action$
  .ofType(CHANGE_PLAYER_STATUS)
  .mergeMap(() => {
    playerTap.playAsync()
    return Observable.empty()
  })

const changePlayerColorEpic = action$ => action$
  .ofType(CHANGE_PLAYER_COLOR)
  .mergeMap((action) => {
    let result = Observable.empty()
    if (action.meta && action.meta.playerId) {
      const {
        meta: { playerId }
      } = action
      result = Observable.of(changePlayerStatus(playerId, PLAYER_STATUSES.SELECTING_LIFE))
    }
    return result
  })

const changePlayerLifeEpic = action$ => action$
  .ofType(CHANGE_PLAYER_LIFE)
  .mergeMap((action) => {
    let result = Observable.empty()
    if (action.meta && action.meta.playerId) {
      const {
        meta: { playerId }
      } = action
      result = Observable.of(changePlayerStatus(playerId, PLAYER_STATUSES.READY_TO_FIGHT))
    }
    return result
  })

const changePlayerStatusToFightEpic = (action$, { getState }) => action$
  .ofType(CHANGE_PLAYER_STATUS)
  .mergeMap(() => {
    const state = getState()
    const playerList = getPlayerList(state)
    const readyToFightPlayers = getReadyToFightPlayerList(state)

    let action = Observable.empty()

    if (playerList.length === readyToFightPlayers.length) {
      action = readyToFightPlayers.map(({ id }) => changePlayerStatus(id, PLAYER_STATUSES.FIGTHING))
    }

    return action
  })

const restartEpic = action$ => action$
  .ofType(RESTART)
  .mergeMap(() => [
    changeColor(null),
    changeLife(Infinity),
    changeStatus(PLAYER_STATUSES.SELECTING_COLOR)
  ])

export const epic = combineEpics(
  playerEpic,
  decreasePlayerLifeToStatusDoneEpic,
  changePlayerStatusToStatusDoneEpic,
  changePlayerStatusToSoundEpic,
  changePlayerColorEpic,
  changePlayerLifeEpic,
  changePlayerStatusToFightEpic,
  restartEpic,
  decreasePlayerLifeToAggregateEpic,
  increasePlayerLifeToAggregateEpic
)

import 'rxjs'
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import idReducer, {
  STATE_KEY as ID_KEY,
  epic as idEpic,
} from '#modules/player/id'

import lifeReducer, {
  STATE_KEY as LIFE_KEY,
  epic as lifeEpic,
} from '#modules/player/life'

import colorReducer, {
  STATE_KEY as COLOR_KEY,
  epic as colorEpic,
} from '#modules/player/color'

import poisonReducer, {
  STATE_KEY as POISON_KEY,
  epic as poisonEpic,
} from '#modules/player/poison'

import statusReducer, {
  STATE_KEY as STATUS_KEY,
  epic as statusEpic,
} from '#modules/player/status'

// state key
export const STATE_KEY = 'player'

// State

// Actions
export const ATTACK = `my-games/${STATE_KEY}/ATTACK`
export const HEAL = `my-games/${STATE_KEY}/HEAL`

// Actions creator

export const attack = damage => ({
  type: ATTACK,
  payload: {
    damage,
  },
})

export const heal = healing => ({
  type: HEAL,
  payload: {
    healing,
  },
})

// Reducers
export default function playerReducer(
  state,
  action
) {
  const {
    type,
  } = action

  switch (type) {
    default:
      return combineReducers({
        [ID_KEY]: idReducer,
        [LIFE_KEY]: lifeReducer,
        [COLOR_KEY]: colorReducer,
        [POISON_KEY]: poisonReducer,
        [STATUS_KEY]: statusReducer,
      })(state, action)
  }
}

// Selectors

// Epics
export const epic = combineEpics(
  idEpic,
  lifeEpic,
  colorEpic,
  statusEpic,
  poisonEpic
)

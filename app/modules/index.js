import { combineEpics } from 'redux-observable'
import { combineReducers } from 'redux'

import appReducer, {
  STATE_KEY as APP_KEY,
  epic as appEpic,
} from '#modules/app'

import playerListReducer, {
  STATE_KEY as PLAYER_LIST_KEY,
  epic as playerEpic,
} from '#modules/player-list'

export const KEY = 'my-life'

// Reducers
export default combineReducers({
  [APP_KEY]: appReducer,
  [PLAYER_LIST_KEY]: playerListReducer,
})

// Epics
export const epic = combineEpics(
  appEpic,
  playerEpic
)

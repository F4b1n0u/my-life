import 'rxjs'
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import valueReducer, {
  STATE_KEY as VALUE_STATE_KEY,
  epic as valueEpic,
} from '#modules/player/poison/value'

import isEditingReducer, {
  STATE_KEY as IS_EDITING_KEY,
  epic as isEditingEpic,
} from '#modules/player/poison/is-active'

// state key
export const STATE_KEY = 'poison'

// State

// Actions

// Action creators

// Reducers
export default combineReducers({
  [VALUE_STATE_KEY]: valueReducer,
  [IS_EDITING_KEY]: isEditingReducer,
})

// Action Creators

// Epics
export const epic = combineEpics(
  valueEpic,
  isEditingEpic
)

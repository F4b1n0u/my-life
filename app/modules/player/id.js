import 'rxjs'
import { combineEpics } from 'redux-observable'

import { ADD } from '#modules/player-list'
// state key
export const STATE_KEY = 'id'


// State
const initialState = null


// Actions


// Action creators


// Reducers
function reducer(
  state = initialState,
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

      return id
    }

    default:
      return state
  }
}

export default reducer


// Action Creators


// Epics

export const epic = combineEpics()

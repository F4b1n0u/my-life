import 'rxjs'
import { combineEpics } from 'redux-observable'

export const STATUSES = {
  SELECTING_COLOR: 'SELECTING_COLOR',
  SELECTING_LIFE: 'SELECTING_LIFE',
  READY_TO_FIGHT: 'READY_TO_FIGHT',
  FIGTHING: 'FIGTHING',
  DONE: 'DONE',
}

// state key
export const STATE_KEY = 'status'

// State
const initialState = STATUSES.SELECTING_COLOR

// Actions
export const INIT = `my-games/${STATE_KEY}/INIT`
export const CHANGE = `my-games/${STATE_KEY}/CHANGE`

// Action creators
export const init = (status = initialState) => ({
  type: INIT,
  payload: {
    status,
  },
})

export const change = status => ({
  type: CHANGE,
  payload: {
    status,
  },
})

// Reducers
function reducer(
  state = initialState,
  {
    type,
    payload = {},
  }
) {
  switch (type) {
    case INIT:
      return payload.status
    case CHANGE:
      return payload.status
    default:
      return state
  }
}

export default reducer


// Action Creators

// Epics
export const epic = combineEpics()

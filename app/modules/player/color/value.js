import 'rxjs'
import { combineEpics } from 'redux-observable'

export const COLORS = {
  WHITE: 'WHITE',
  BLUE: 'BLUE',
  BLACK: 'BLACK',
  RED: 'RED',
  GREEN: 'GREEN',
}

// state key
const LIFE_KEY = 'color' // TODO check why the import does not work
export const STATE_KEY = 'value'

// State
const initialState = null

// Actions
export const INIT = `my-games/${LIFE_KEY}/${STATE_KEY}/INIT`
export const CHANGE = `my-games/${LIFE_KEY}/${STATE_KEY}/CHANGE`

// Action creators
export const init = (color = initialState) => ({
  type: INIT,
  payload: {
    color,
  },
})

export const change = color => ({
  type: CHANGE,
  payload: {
    color,
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
      return payload.color
    case CHANGE:
      return payload.color
    default:
      return state
  }
}

export default reducer


// Action Creators

// Epics
export const epic = combineEpics()

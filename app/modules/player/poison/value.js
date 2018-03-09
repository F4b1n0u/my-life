import 'rxjs'
import { combineEpics } from 'redux-observable'

// state key
const LIFE_KEY = 'poison' // TODO check why the import does not work
export const STATE_KEY = 'value'

// State
const initialState = 0

// Actions
export const CHANGE = `my-games/${LIFE_KEY}/${STATE_KEY}/CHANGE`
export const INCREASE = `my-games/${LIFE_KEY}/${STATE_KEY}/INCREASE`
export const DECREASE = `my-games/${LIFE_KEY}/${STATE_KEY}/DECREASE`

// Action creators
export const change = (poison = initialState) => ({
  type: CHANGE,
  payload: {
    poison,
  },
})

export const increase = (step = 1) => ({
  type: INCREASE,
  payload: {
    step,
  },
})

export const decrease = (step = 1) => ({
  type: DECREASE,
  payload: {
    step,
  },
})

// Reducers
export default (
  state = initialState,
  {
    type,
    payload = {},
  }
) => {
  switch (type) {
    case CHANGE:
      return payload.poison
    case INCREASE:
      return state + payload.step
    case DECREASE:
      return state - payload.step
    default:
      return state
  }
}

// Action Creators

// Epics
export const epic = combineEpics()

// TODO debounce the life change to cumulate the changes

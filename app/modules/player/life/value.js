import 'rxjs'
import { combineEpics } from 'redux-observable'

// state key
const LIFE_KEY = 'life' // TODO check why the import does not work
export const STATE_KEY = 'value'

export const LIFES = [20, 30, 40]

// State
const initialState = Infinity

// Actions
export const CHANGE = `my-games/${LIFE_KEY}/${STATE_KEY}/CHANGE`
export const INCREASE = `my-games/${LIFE_KEY}/${STATE_KEY}/INCREASE`
export const DECREASE = `my-games/${LIFE_KEY}/${STATE_KEY}/DECREASE`

// Action creators
export const change = (life = initialState) => ({
  type: CHANGE,
  payload: {
    life,
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
      return payload.life
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

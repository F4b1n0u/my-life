import 'rxjs'
import { combineEpics } from 'redux-observable'

// state key
const LIFE_KEY = 'poison' // TODO check why the import does not work
export const STATE_KEY = 'isActive'


// State
const initialState = false


// Actions
export const TOGGLE = `my-games/${LIFE_KEY}/${STATE_KEY}/TOGGLE`


// Action creators
export const toggle = () => ({
  type: TOGGLE,
})


// Reducers
export default (
  state = initialState,
  {
    type
  }
) => {
  switch (type) {
    case TOGGLE:
      return !state
    default:
      return state
  }
}

// Action Creators


// Epics
export const epic = combineEpics()

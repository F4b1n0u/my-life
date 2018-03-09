import 'rxjs'
import { combineEpics } from 'redux-observable'

// state key
const LIFE_KEY = 'life' // TODO check why the import does not work
export const STATE_KEY = 'isEditing'

// State
const initialState = false

// Actions
export const EDIT = `my-games/${LIFE_KEY}/${STATE_KEY}/EDIT`

// Action creators
export const edit = (isEditing = true) => ({
  type: EDIT,
  payload: {
    isEditing,
  }
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
    case EDIT:
      return payload.isEditing
    default:
      return state
  }
}

export default reducer


// Action Creators


// Epics

export const epic = combineEpics()

import 'rxjs'
import { Alert } from 'react-native'
import { Observable } from 'rxjs/Observable'
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import Expo, { Font, Asset } from 'expo'

import { add as addPlayer } from '#modules/player-list'

import mplantinFont from '#fonts/Mplantin.ttf'
import magicIconsFont from '#fonts/magic-icons.ttf'
import diceFont from '#fonts/dice.ttf'

import appBackground from '#images/background.png'
import playerBlackBackground from '#images/black.png'
import playerBlueBackground from '#images/blue.png'
import playerGreenBackground from '#images/green.png'
import playerRedBackground from '#images/red.png'
import playerWhiteBackground from '#images/white.png'

import tap from '#sounds/tap.wav'
import magicFireball from '#sounds/magic-fireball.wav'
import whooshWoow from '#sounds/whoosh-woow.wav'
import victory from '#sounds/victory.wav'

import {
  playerTap,
  playerMagicFireball,
  playerWhooshWoow,
  playerVictory,
} from '#utils/audio'

// state key
export const STATE_KEY = 'app'


// State
const initialState = {
  isFontLoaded: false,
  isLoaded: false,
  status: {
    isLoading: false,
  }
}


// Actions
export const START_LOAD = `my-games/${STATE_KEY}/START_LOAD`
export const END_LOAD_SUCCESS = `my-games/${STATE_KEY}/END_LOAD_SUCCESS`
export const END_LOAD_FAILURE = `my-games/${STATE_KEY}/END_LOAD_FAILURE`
export const DISPLAY_GENERIC_ERROR = `my-games/${STATE_KEY}/DISPLAY_GENERIC_ERROR`


// Reducers
function isLoadedReducer(
  state = initialState.isLoaded,
  action
) {
  switch (action.type) {
    case END_LOAD_SUCCESS:
      return true
    case END_LOAD_FAILURE:
      return false
    default:
      return state
  }
}

function statusReducer(
  state = initialState.status,
  {
    type,
    payload,
  }
) {
  switch (type) {
    case START_LOAD:
      return {
        pending: true,
        error: null,
      }
    case END_LOAD_SUCCESS:
      return initialState.status
    case END_LOAD_FAILURE:
      return {
        pending: false,
        error: payload.error,
      }
    default:
      return state
  }
}

export default combineReducers({
  isLoaded: isLoadedReducer,
  status: statusReducer,
})


// Selectors
export const isLoading = state => state[STATE_KEY].status.isLoading
export const isLoaded = state => state[STATE_KEY].isLoaded


// Action Creators
export const startLoad = () => ({
  type: START_LOAD,
})
export const endLoad = () => ({
  type: END_LOAD_SUCCESS,
})
export const endLoadFailure = () => ({
  type: END_LOAD_FAILURE,
})
export const displayGenericError = error => ({
  type: DISPLAY_GENERIC_ERROR,
  payload: {
    error,
  },
})


// Epics
const displayGenericErrorEpic = action$ => action$
  .ofType(DISPLAY_GENERIC_ERROR)
  .mergeMap(() => {
    Alert.alert(
      'Oops !!',
      'it looks like something \nwent wrong :/\try later',
      {
        cancelable: true,
      }
    )

    return Observable.empty()
  })
  
const loadAssets = async () => {
  const images = [
    appBackground,
    playerBlackBackground,
    playerBlueBackground,
    playerGreenBackground,
    playerRedBackground,
    playerWhiteBackground,
  ].map(async image => {
    Asset.fromModule(image).downloadAsync()
  })

  await playerTap.loadAsync(tap)
  await playerMagicFireball.loadAsync(magicFireball)
  await playerWhooshWoow.loadAsync(whooshWoow)
  await playerVictory.loadAsync(victory)

  const fonts = Font.loadAsync({
    Mplantin: mplantinFont,
    magicIcons: magicIconsFont,
    dice: diceFont,
  })
  
  await Promise.all([
    images,
    fonts,
  ])
}

const startLoadEpic = action$ => action$
  .ofType(START_LOAD)
  .mergeMap(() => Observable.fromPromise(loadAssets()))
  .mergeMap(() => Observable.of(endLoad()))

const endLoadEpic = action$ => action$
  .ofType(END_LOAD_SUCCESS)
  .mergeMap(() => [
    addPlayer({
      id: 1,
    }),
    addPlayer({
      id: 2,
    })
  ])

export const epic = combineEpics(
  displayGenericErrorEpic,
  startLoadEpic,
  endLoadEpic,
)

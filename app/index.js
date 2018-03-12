import Expo, { KeepAwake } from 'expo'
import React from 'react'
import { Provider } from 'react-redux'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'
import Sentry from 'sentry-expo'
import { SENTRY_URI } from 'react-native-dotenv'

import storeConfigure from '#store'

import {
  startLoad,
} from '#modules/app'

import AppComponent from '#containers/app'

Sentry
  .config(SENTRY_URI)
  .install()

const initialState = {}
const {
  store,
} = storeConfigure(initialState)

const Index = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const App = styled(AppComponent)`
  flex: 1;
  flex-direction: column;
`


StatusBar.setHidden(true)
KeepAwake.activate()

store.dispatch(startLoad())

Expo.registerRootComponent(Index)

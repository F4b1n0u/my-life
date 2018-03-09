import React, { Component } from 'react'
import { UIManager, View } from 'react-native'
import styled from 'styled-components/native'
import Expo from 'expo'
import { arrayOf, bool, number } from 'prop-types'
import { version } from '../../package.json'
import { VERSION_DISPLAY_DURATION } from 'react-native-dotenv'

import appBackground from '#images/background.png'

import PlayerListContainer from '#containers/player-list'

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default class AppComponent extends Component {
  static propTypes = {
    isLoaded: bool.isRequired,
    style: arrayOf(number).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isShowingVersion: true,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isShowingVersion: false
      })
    }, VERSION_DISPLAY_DURATION)
  }

  render() {
    const {
      style,
      isLoaded,
    } = this.props

    const {
      isShowingVersion,
    } = this.state

    return isLoaded ? (
      <View
        style={style}
      >
        <Background />
        <SafeAreaView>
          <PlayerList />
          {isShowingVersion ? (
            <AppVersion>
              {version}
            </AppVersion>
          ) : null}
        </SafeAreaView>
      </View>
    ) : (
      <Expo.AppLoading />
    )
  }
}

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`

const Background = styled.Image
  .attrs({
    source: appBackground,
  })`
    position: absolute;
    top: -10;
    bottom: -10;
    left: -10;
    right: -10;
    height: 110%;
    width: 110%;
  `

const PlayerList = styled(PlayerListContainer)`
  position: relative;
  flex: 1;
  flex-direction: column;
`

const AppVersion = styled.Text`
  position: absolute;
  top: 10%;
  left: 0;
  font-size: 10;
  transform: rotate(90deg);
`

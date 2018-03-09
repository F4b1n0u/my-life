import React from 'react'
import { View, LayoutAnimation, Animated } from 'react-native'
import styled from 'styled-components/native'
import { arrayOf, func, number, string } from 'prop-types'

import ColorSelectorComponent from '#components/color-selector'
import PoisonSwitchComponent from '#components/poison-switch'
import LifeSelectorComponent from '#components/life-selector'

import { STATUSES as PLAYER_STATUSES } from '#modules/player/status'

export default class PlayerSettingComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimationInProgress: false,
      animationProgress: new Animated.Value(0)
    }
  }

  componentWillUpdate({ status: nextStatus }) {
    const {
      status: currentStatus
    } = this.props

    const {
      isAnimationInProgress,
    } = this.state

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    if (!isAnimationInProgress) {
      if (
        currentStatus === PLAYER_STATUSES.SELECTING_COLOR &&
        nextStatus === PLAYER_STATUSES.SELECTING_LIFE
      ) {
        this._animate(1)
      }

      if (
        [
          PLAYER_STATUSES.SELECTING_LIFE,
          PLAYER_STATUSES.READY_TO_FIGHT,
        ].includes(currentStatus) &&
        nextStatus === PLAYER_STATUSES.SELECTING_COLOR
      ) {
        this._animate(0)
      }
    }
  }

  _animate(to) {
    const {
      isAnimationInProgress,
      animationProgress,
    } = this.state

    if (isAnimationInProgress) {
      return
    }

    this.setState({
      isAnimationInProgress: true,
    }, () => {
      Animated.timing(
        animationProgress,
        {
          duration: 250,
          toValue: to,
          useNativeDriver: true,
        }
      ).start(() => {
        this.setState({
          isAnimationInProgress: false,
        })
      })
    })
  }

  render() {
    const {
      color,
      life,
      status,
      style,
      poison,
      changePlayerStatus,
      changePlayerColor,
      changePlayerLife,
      togglePlayerIsPoisonActive,
    } = this.props

    const {
      animationProgress,
    } = this.state

    const isColorSelectorInFront = status === PLAYER_STATUSES.SELECTING_COLOR
    const isLifeSelectorInFront = [
      PLAYER_STATUSES.SELECTING_LIFE,
      PLAYER_STATUSES.READY_TO_FIGHT,
    ].includes(status)

    return (
      <Wrapper
        onPress={() => {
          if (!isColorSelectorInFront) {
            changePlayerStatus(PLAYER_STATUSES.SELECTING_COLOR)
          }
        }}
      >
        <View
          style={style}
        >
          <ColorSelector
            isInFront={isColorSelectorInFront}
            animationProgress={animationProgress}
            status={status}
            seletedColor={color}
            onSelect={(selectedColor) => {
              if (isColorSelectorInFront) {
                changePlayerColor(selectedColor)
              } else {
                changePlayerStatus(PLAYER_STATUSES.SELECTING_COLOR)
              }
            }}
          />
          {/* <PoisonSwitch
            isActive={poison.isActive}
            isInFront={isColorSelectorInFront}
            animationProgress={animationProgress}
            onToggle={() => {
              if (isColorSelectorInFront) {
                togglePlayerIsPoisonActive()
              } else {
                changePlayerStatus(PLAYER_STATUSES.SELECTING_COLOR)
              }
            }}
          /> */}
          <LifeSelector
            isInFront={isLifeSelectorInFront}
            animationProgress={animationProgress}
            color={color}
            selectedLife={life}
            onSelect={(selectedLife) => {
              if (isLifeSelectorInFront) {
                changePlayerLife(selectedLife)
              }
            }}
          />
        </View>
      </Wrapper>
    )
  }
}

PlayerSettingComponent.defaultProps = {
  color: null,
}

PlayerSettingComponent.propTypes = {
  color: string,
  status: string.isRequired,
  style: arrayOf(number).isRequired,
  changePlayerStatus: func.isRequired,
  changePlayerColor: func.isRequired,
  changePlayerLife: func.isRequired,
}

const Wrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex: 1;
`

const ColorSelector = styled(ColorSelectorComponent)`
  position: absolute;
  top: ${({ isInFront }) => `${isInFront ? 50 : 80}%`};
  left: 50%;
`

const PoisonSwitch = styled(PoisonSwitchComponent)`
  position: absolute;
  top: ${({ isInFront }) => `${isInFront ? 50 : 80}%`};
  left: 50%;
`

const LifeSelector = styled(LifeSelectorComponent)`
  position: absolute;
  top: ${({ isInFront }) => `${isInFront ? 50 : -25}%`};
  left: 0;
  right: 0;

  flex-direction: row;
  align-items: center;  
  justify-content: space-around;
`

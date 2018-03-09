import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import ShadowText from '#components/shadow-text'

import { verticalScale } from '#utils/dimension'

const PoisonSwitchComponent = ({
  style,
  onToggle,
  isActive,
  animationProgress,
}) => (
  <Animated.View
    style={style}
  >
    <PoisonSwitchWrapper
      style={{
        transform: [{
          scale: animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1 / 3],
          })
        }]
      }}
      onPress={() => {
        onToggle()
      }}
    >
      <PoisonSwitch
        isDisabled={!isActive}
      >
        {'A'}
      </PoisonSwitch>
    </PoisonSwitchWrapper>
  </Animated.View>
)

PoisonSwitchComponent.propTypes = {}

export default PoisonSwitchComponent

const PoisonSwitchWrapper = styled.TouchableOpacity`
`
const poisonSwitchSizeBase = 90
const PoisonSwitch = styled(ShadowText)`
  position: absolute;
  left: 50%;
  
  flex: 1;
  
  font-family: 'magicIcons';

  font-size: ${verticalScale(poisonSwitchSizeBase)};

  margin-top: ${-1 * verticalScale(poisonSwitchSizeBase / 2)};
  margin-left: ${-1 * verticalScale(poisonSwitchSizeBase / 2)};

  color: #ffffff};
`

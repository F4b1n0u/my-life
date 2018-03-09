import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import ShadowText from '#components/shadow-text'

import { COLORS } from '#modules/player/color/value'

import { colorToSelectorLetter, colorToExa } from '#utils/color'
import { verticalScale } from '#utils/dimension'

const colorValues = Object.values(COLORS)

const ColorSelectorComponent = ({
  style,
  isInFront,
  onSelect,
  seletedColor,
  animationProgress,
}) => (
  <Animated.View
    style={style}
  >
    {colorValues.map((currentColor, colorIndex) => (
      <ColorSelectorWrapper
        key={`${currentColor}`}
        isInFront={isInFront}
        animationProgress={animationProgress}
        position={colorIndex}
        style={{
          transform: [{
            scale: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1 / 3],
            })
          }]
        }}
        onPress={() => {
          onSelect(currentColor)
        }}
      >
        <ColorSelector
          color={currentColor}
          isDisabled={currentColor === seletedColor}
        >
          {colorToSelectorLetter(currentColor)}
        </ColorSelector>
      </ColorSelectorWrapper>
    ))}
  </Animated.View>
)

ColorSelectorComponent.propTypes = {}

export default ColorSelectorComponent

const colorSelectorSizeBase = 90
const inFronRatio = 3
const ColorSelectorWrapper = styled.TouchableOpacity`
  position: absolute;
  left: 50%;
  
  flex: 1;
  justify-content: center;
  align-items: center;

  height: ${verticalScale(colorSelectorSizeBase)};
  width: ${verticalScale(colorSelectorSizeBase)};

  margin-left: ${({ position, isInFront }) => {
    const colorSelectorSize = isInFront ?
      colorSelectorSizeBase :
      colorSelectorSizeBase / inFronRatio
    return Math.cos(2 * Math.PI / 5 * position - Math.PI / 2)
      * verticalScale(colorSelectorSize)
      - verticalScale(colorSelectorSizeBase / 2)
  }};

  margin-top: ${({ position, isInFront }) => {
    const colorSelectorSize = isInFront ?
      colorSelectorSizeBase :
      colorSelectorSizeBase / inFronRatio
    return Math.sin(2 * Math.PI / 5 * position - Math.PI / 2)
      * verticalScale(colorSelectorSize)
      - verticalScale(colorSelectorSizeBase / 2)
  }};
`

const ColorSelector = styled(ShadowText)`
  flex: 1;
  
  color: ${({ color }) => colorToExa(color)};

  font-family: 'magicIcons';

  font-size: ${verticalScale(colorSelectorSizeBase)};
`

import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import ShadowText from '#components/shadow-text'

import { LIFES } from '#modules/player/life/value'

import { colorToTokenLetter, colorToExa } from '#utils/color'
import { verticalScale } from '#utils/dimension'

const LifeSelectorComponent = ({
  style,
  selectedLife,
  color,
  onSelect,
}) => (
  <View
    style={style}
  >
    {
      LIFES.map(life => (
        <LifeReset
          key={`${life}`}
          onPress={() => {
            onSelect(life)
          }}
        >
          <ColorToken
            color={color}
            isDisabled={life === selectedLife}
          >
            {colorToTokenLetter(color)}
          </ColorToken>
          <LifeValue>
            {life}
          </LifeValue>
        </LifeReset>
      ))
    }
  </View>
)

LifeSelectorComponent.propTypes = {}

export default LifeSelectorComponent

const lifeResetSize = 100
const LifeReset = styled.TouchableOpacity`
  height: ${verticalScale(lifeResetSize)};
  width: ${verticalScale(lifeResetSize)};

  align-items: center;
  justify-content: center;

  margin-top: ${-1 * verticalScale(lifeResetSize / 1.5)};
`

const ColorToken = styled(ShadowText)`
  font-size: ${verticalScale(lifeResetSize)};
  color: ${({ color }) => colorToExa(color)};
  font-family: 'magicIcons';
`

const lifeValueSize = lifeResetSize / 1.428 // 10/7
const LifeValue = styled(ShadowText).attrs({
  numberOfLines: 1,
})`
  position: absolute;

  font-size: ${verticalScale(lifeValueSize)};
  color: #ffffff;
  font-family: 'Mplantin';
`

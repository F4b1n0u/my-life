import React from 'react'
import styled from 'styled-components/native'
import { arrayOf, number, func } from 'prop-types'

import ShadowText from '#components/shadow-text'

import { lifeToOutcomeLetter } from '#utils/life'

import { verticalScale } from '#utils/dimension'

const OutcomeComponent = ({
  life,
  style,
  onRestart,
}) => (
  <ResultIconWrapper
    style={style}
    onPress={onRestart}
  >
    <ResultIcon
      life={life}
    >
      {lifeToOutcomeLetter(life)}
    </ResultIcon>
  </ResultIconWrapper>

)

OutcomeComponent.propTypes = {
  life: number.isRequired,
  onRestart: func.isRequired,

  style: arrayOf(number).isRequired,
}

export default OutcomeComponent


const ResultIconWrapper = styled.TouchableOpacity`
`

const ResultIcon = styled(ShadowText)`
  position: absolute;
  font-size: ${verticalScale(200)};
  color: ${({ life }) => life > 0 ? '#FFD700' : '#ff1414'};
  font-family: 'magicIcons';
`

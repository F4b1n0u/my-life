import React from 'react'
import { View, Animated, LayoutAnimation, Easing } from 'react-native'
import styled from 'styled-components/native'
import { arrayOf, func, number, string } from 'prop-types'
import { DangerZone } from 'expo'
import { debounce } from 'lodash'

import healAnimation from '#animations/heal'
import attackAnimation from '#animations/attack'

import ShadowText from '#components/shadow-text'

import { verticalScale } from '#utils/dimension'

import { colorToExa, colorToTokenLetter } from '#utils/color'
import { lifeDeltaToToken } from '#utils/life'
import { getDiceOutcome } from '#utils/dice'

const { Lottie } = DangerZone

export default class BattlefieldComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lifeDelta: 0,
      diceOutcome: getDiceOutcome(),
    }
  }

  _createAnimation = ({
    animationName,
    duration,
    canRestart = false,
  }) => {
    let progress = new Animated.Value(0)
    let animation

    this.setState({
      [animationName]: {
        duration,
        isInProgress: false,
        progress,
      },
    })

    const getAnimation = () => Animated.timing(
      progress,
      {
        duration,
        toValue: 1,
        useNativeDriver: true,
      }
    )

    const onDone = () => {
      const {
        isInProgress
      } = this.state[animationName]
      if (isInProgress) {
        if (animationName === 'animationLifeDelta') {
          console.log(isInProgress, progress)
        }
        this.setState({
          [animationName]: {
            duration,
            isInProgress: false,
            progress,
          }
        }, ()=> {
          animation = null
          progress = new Animated.Value(0)
        })
      }
    }

    return {
      play: () => {
        const {
          isInProgress
        } = this.state[animationName]

        if(isInProgress && canRestart) {
          progress.stopAnimation()
          progress.setValue(0)
          animation.start(onDone)
        } else if(!isInProgress) {
          this.setState({
            [animationName]: {
              duration: duration,
              isInProgress: true,
              progress,
            },
          },() => {
            animation = getAnimation()
            animation.start(onDone)
          })
        }
      }
    }
  }

  componentWillMount() {
    this.healingAnimation = this._createAnimation({
      animationName: 'animationHeal',
      duration: 500,
      canRestart: true,
    })
    this.attackingAnimation = this._createAnimation({
      animationName: 'animationAttack',
      duration: 500,
      canRestart: true,
    })
    this.lifeDeltaAnimation = this._createAnimation({
      animationName: 'animationLifeDelta',
      duration: 2000,
      canRestart: true,
    })
    this.diceAnimation = this._createAnimation({
      animationName: 'animationDice',
      duration: 1500,
      canRestart: true,
    })
  }

  componentWilldUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }

  componentDidUpdate({ life: previousLife }, { lifeDelta: previousLifeDelta }) {
    const {
      life: currentLive
    } = this.props

    const {
      currentLifeDelta
    } = this.state

    const nextLifeDelta = currentLive - previousLife

    if (nextLifeDelta) {
      this.setState({
        lifeDelta: nextLifeDelta,
      }, () => {
        this.lifeDeltaAnimation.play()
      })
    }
  }

  throwDice = () => {
    this.setState(({ previousDiceAngle }) => ({
      diceOutcome: getDiceOutcome()
    }))
  }

  render() {
    const {
      life,
      color,
      style,
      heal,
      attack,
    } = this.props

    const {
      animationHeal: {
        progress: healAnimationProgress,
      },
      animationAttack: {
        progress: attackAnimationProgress,
      },
      animationLifeDelta: {
        isInProgress: islifeDeltaAnimationInProgress,
        progress: lifeDeltaAnimationProgress,
      },
      animationDice: {
        progress: diceAnimationProgress,
        duration: diceAnimationDuration,
      },
      lifeDelta,
      diceOutcome,
    } = this.state

    const haslifeDelta = lifeDelta !== 0

    return (
      <View
        style={style}
      >
        <LifeIndicator>
          <LifeToken
            color={color}
          >
            {colorToTokenLetter(color)}
          </LifeToken>
          <Life
            life={life}
          >
            {life}
          </Life>
        </LifeIndicator>
        {haslifeDelta ? (
          <LifeDeltaIndicator
            key="life-delta"
            style={{
              transform: [{
                scale: lifeDeltaAnimationProgress.interpolate({
                  inputRange: [0, .2, 1],
                  outputRange: [1, 5 / 4, .6],
                })
              }],
              opacity: lifeDeltaAnimationProgress.interpolate({
                inputRange: [0, .1, .4, 1],
                outputRange: [0, 1, 1, 0],
              })
            }}
          >
            <LifeDeltaToken
              lifeDelta={lifeDelta}
            >
              {lifeDeltaToToken(lifeDelta)}
            </LifeDeltaToken>
            <LifeDelta
              lifeDelta={lifeDelta}
            >
              {lifeDelta < 0 ? lifeDelta : `+${lifeDelta}`}
            </LifeDelta>
          </LifeDeltaIndicator>
        ) : null}
      
        <AnimationWrapper
          key="heal"
          style={{
            transform: [{
              scale: healAnimationProgress.interpolate({
                inputRange: [0, .5, 1],
                outputRange: [1, 3 / 2, 1],
              })
            }]
          }}
          onPress={() => {
            this.healingAnimation.play()
            heal()
          }}
        >
          <Heal
            progress={healAnimationProgress}
          />
        </AnimationWrapper>
      
        <AnimationWrapper
          key="attack"
          style={{
            transform: [{
              scale: attackAnimationProgress.interpolate({
                inputRange: [0, .5, 1],
                outputRange: [1, 3 / 2, 1],
              })
            }]
          }}
          onPress={() => {
            this.attackingAnimation.play()
            attack()
          }}
        >
          <Attack
            progress={attackAnimationProgress}
          />
        </AnimationWrapper>
        <DiceCup
          key="dice-cup"
          style={{
            transform: [{
              scale: diceAnimationProgress.interpolate({
                inputRange: [0, .5, 1],
                outputRange: [1, 3 / 2, 1],
              })
            }, {
              rotate: diceAnimationProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [`90deg`, `1170deg`],
              })
            }]
          }}
          onPress={() => {
            this.diceAnimation.play()
            const changes = 3
            for (let delay = 0; delay < changes; delay++) {
              setTimeout(this.throwDice, delay * diceAnimationDuration / (changes + 1))
            }
          }}
        >
          <Dice>
            {diceOutcome}
          </Dice>
        </DiceCup>
      </View>
    )
  }
}

BattlefieldComponent.propTypes = {
  life: number.isRequired,
  color: string.isRequired,
  style: arrayOf(number).isRequired,
  heal: func.isRequired,
  attack: func.isRequired,
}

// the margin bottom should depend of the height of the screen
const AnimationWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  width: 40%;
  margin-bottom: 20;
`


const Heal = styled(Lottie)
  .attrs({
    loop: false,
    source: healAnimation,
  })`
    flex: 1;
  `

const Attack = styled(Lottie)
  .attrs({
    loop: false,
    source: attackAnimation,
  })`
    flex: 1;
  `

// the font size should depend of the height of the screen
// ideally should be near the half of the player view
const lifeIndicatorSize = 140
const LifeIndicator = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
`

const LifeToken = styled(ShadowText)`
  font-size: ${verticalScale(lifeIndicatorSize)};
  color: ${({ color }) => colorToExa(color)};
  font-family: 'magicIcons';
`

const lifeSize = lifeIndicatorSize / 10 * 7
const colorThreshold = 10
const colorStep = 50 / colorThreshold
const Life = styled(ShadowText).attrs({
  numberOfLines: 1,
})`
  position: absolute;
  
  margin-top: ${verticalScale(lifeSize) / 4};
  font-size: ${verticalScale(lifeSize)};
  color: hsl(0, 100%, ${
    ({ life }) => {
      if (life > colorThreshold) {
        return 100
      }
      return 100 - (colorStep * (colorThreshold - life))
    }
  }%);
  
  font-family: 'Mplantin';
`

const lifeDeltaIndicatorSize = 140
const LifeDeltaIndicator = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
`

const LifeDeltaToken = styled(ShadowText)`
  font-size: ${verticalScale(lifeDeltaIndicatorSize)};
  color: ${({ lifeDelta }) => lifeDelta > 0 ? '#00ff0070' : '#ff000070 '};
  font-family: 'magicIcons';
`

const lifeDeltaSize = lifeDeltaIndicatorSize / 10 * 7
const LifeDelta = styled(ShadowText).attrs({
  numberOfLines: 1,
})`
  position: absolute;
  
  margin-top: ${verticalScale(lifeDeltaSize) / 4};
  font-size: ${verticalScale(lifeDeltaSize)};
  color: #ffffff;
  
  font-family: 'Mplantin';
`

const DiceCup = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  position: absolute;

  top: 7%;

  left: 32.5%;

  height: 35%;
  width: 35%;

  justify-content: center;
  align-items: center;
`

const Dice = styled.Text.attrs({
  textAlign: 'center',
  includeFontPadding: false,
  textAlignVertical: 'bottom',
  lineHeight: verticalScale(60),
})`
  font-family: 'dice';
  font-size: ${verticalScale(60)};

  color: #ffffff;

  justify-content: center;
  align-items: center;
  text-align-vertical: bottom;
`
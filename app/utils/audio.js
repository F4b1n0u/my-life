import { Audio } from 'expo'

export const playerTap = new Audio.Sound()
export const playerMagicFireball = new Audio.Sound()
export const playerWhooshWoow = new Audio.Sound()
export const playerVictory = new Audio.Sound()

playerTap.setOnPlaybackStatusUpdate((status) => {
  if (status.didJustFinish) {
    playerTap.stopAsync()
  }
})

playerMagicFireball.setOnPlaybackStatusUpdate((status) => {
  if (status.didJustFinish) {
    playerMagicFireball.stopAsync()
  }
})

playerWhooshWoow.setOnPlaybackStatusUpdate((status) => {
  if (status.didJustFinish) {
    playerWhooshWoow.stopAsync()
  }
})

playerVictory.setOnPlaybackStatusUpdate((status) => {
  if (status.didJustFinish) {
    playerVictory.stopAsync()
  }
})

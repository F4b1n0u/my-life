import playerBlackBackground from '#images/black.png'
import playerBlueBackground from '#images/blue.png'
import playerGreenBackground from '#images/green.png'
import playerRedBackground from '#images/red.png'
import playerWhiteBackground from '#images/white.png'

export const colorToExa = (color) => {
  switch (color) {
    case 'WHITE':
      return '#fff7a8'
    case 'BLUE':
      return '#84cbf5'
    case 'BLACK':
      return '#c9aeab'
    case 'RED':
      return '#f08965'
    case 'GREEN':
      return '#7dd195'
    default:
      return '#000000'
  }
}

export const colorToSelectorLetter = (color) => {
  // return 'C'
  switch (color) {
    case 'WHITE':
      return 'R'
    case 'BLUE':
      return 'Q'
    case 'BLACK':
      return 'P'
    case 'RED':
      return 'O'
    case 'GREEN':
      return 'N'
    default:
      return ''
  }
}

export const colorToTokenLetter = (color) => {
  // return 'B'
  switch (color) {
    case 'WHITE':
      return 'W'
    case 'BLUE':
      return 'V'
    case 'BLACK':
      return 'U'
    case 'RED':
      return 'T'
    case 'GREEN':
      return 'S'
    default:
      return ''
  }
}

export const colorToImage = (color) => {
  switch (color) {
    case 'WHITE':
      return playerWhiteBackground
    case 'BLUE':
      return playerBlueBackground
    case 'BLACK':
      return playerBlackBackground
    case 'RED':
      return playerRedBackground
    case 'GREEN':
      return playerGreenBackground
    default:
      return null
  }
}

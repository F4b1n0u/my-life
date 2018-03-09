import { connect } from 'react-redux'

import PlayerListComponent from '#components/player-list'

import {
  getPlayerList,
  getOpponentMap,
} from '#selectors/player-list'

import {
  changePlayerStatus,
  changePlayerColor,
  changePlayerLife,
  attackPlayer,
  healPlayer,
  togglePlayerIsPoisonActive,
  restart,
} from '#modules/player-list'

const mapStateToProps = state => ({
  playerList: getPlayerList(state),
  opponentMap: getOpponentMap(state)
})

const mapDispatchToProps = dispatch => ({
  changePlayerStatus: id => status => dispatch(changePlayerStatus(id, status)),
  changePlayerColor: id => color => dispatch(changePlayerColor(id, color)),
  changePlayerLife: id => life => dispatch(changePlayerLife(id, life)),
  togglePlayerIsPoisonActive: id => () => dispatch(togglePlayerIsPoisonActive(id)),
  restartGame: () => dispatch(restart()),
  attack: id => () => dispatch(attackPlayer(id, 1)),
  heal: id => () => dispatch(healPlayer(id, 1)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerListComponent)

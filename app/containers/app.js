import { connect } from 'react-redux'

import App from '#components/app'

import {
  isLoading, isLoaded,
} from '#modules/app'

const mapStateToProps = state => ({
  isLoading: isLoading(state),
  isLoaded: isLoaded(state),
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

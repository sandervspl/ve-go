import React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import { setOnlineState } from './ducks/modules/app';
import AppNavigator from './Navigation';
import * as c from './components/common';

class Root extends React.Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.onConnectionChange);
  }

  onConnectionChange = connected => this.props.setOnlineState(connected);

  onNavigation = (prevState, curState) => updateFocus(curState);

  render() {
    const { online } = this.props.app;

    return (
      <React.Fragment>
        {online === false && <c.PopupTopBar type="error">You are offline.</c.PopupTopBar>}

        <AppNavigator onNavigationStateChange={this.onNavigation} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
});

export default connect(mapStateToProps, { setOnlineState })(Root);

import React from 'react';
import { Text, NetInfo, ActivityIndicator } from 'react-native';
import * as c from './src/components/common';

import PopupTopBar from './src/components/common/PopupTopBar';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      lat: 0,
      lon: 0,
      error: null,
      online: null,
      loading: true,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange);

    this.watchId = navigator.geolocation.watchPosition(
      this.watchPositionSuccess,
      this.watchPositionError,
      {
        timeout: 1000,
        enableHighAccuracy: true,
      },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    NetInfo.isConnected.removeEventListener('connectionChange', this.onConnectionChange);
  }

  onConnectionChange = (connected) => {
    this.setState({
      online: connected,
      loading: false,
    });
  };

  watchPositionError = (err) => {
    this.setState({
      error: err,
    });
  };

  watchPositionSuccess = ({ coords }) => {
    this.setState({
      lat: coords.latitude,
      lon: coords.longitude,
    });
  };

  render() {
    const { error, lat, lon, online, loading } = this.state;

    return (
      <c.Main>
        <c.Container>
          {online === false && (
            <PopupTopBar type="error">
              You are offline.
            </PopupTopBar>
          )}

          {loading ? (
            <ActivityIndicator />
          ) : (
            <c.CenterContainer>
              <c.Title>Location</c.Title>
              <Text>lat: {lat}</Text>
              <Text>lon: {lon}</Text>
            </c.CenterContainer>
          )}

          {error && (
            <c.ErrorText>Error: {error}</c.ErrorText>
          )}

          <c.TextButton onPress={() => this.setModalVisible(true)}>
            <Text>Open Modal</Text>
          </c.TextButton>
        </c.Container>
      </c.Main>
    );
  }
}

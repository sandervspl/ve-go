import React from 'react';
import { View, Text, NetInfo, ActivityIndicator } from 'react-native';
import styled from 'styled-components';

import PopupTopBar from './src/components/common/PopupTopBar';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 20px;
  background-color: #fff;
`;

const LocationContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  margin-bottom: 10px;
`;

const ErrorText = styled.Text`
  margin-top: 10px;
  color: red;
`;

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
    this.setState(state => ({
      online: connected && !state.online,
      loading: false,
    }));
  };

  watchPositionSuccess = ({ coords }) => {
    this.setState({
      lat: coords.latitude,
      lon: coords.longitude,
    });
  };

  watchPositionError = (err) => {
    this.setState({
      error: err,
    });
  };

  render() {
    const { error, lat, lon, online, loading } = this.state;

    return (
      <Container>
        {online === false && (
          <PopupTopBar type="error">
            You are offline.
          </PopupTopBar>
        )}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <LocationContainer>
            <Title>Location</Title>
            <Text>lat: {lat}</Text>
            <Text>lon: {lon}</Text>
          </LocationContainer>
        )}

        {error && (
          <ErrorText>Error: {error}</ErrorText>
        )}
      </Container>
    );
  }
}

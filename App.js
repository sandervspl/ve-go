import React from 'react';
import { Text, NetInfo } from 'react-native';
import styled from 'styled-components';

import PopupTopBar from './src/components/common/PopupTopBar';

const Container = styled.View`
    flex: 1;
    background-color: #fff;
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
    console.log(connected);

    if (!connected && this.state.online) {
      this.setState({ online: false });
    } else if (connected && !this.state.online) {
      this.setState({ online: true });
    }
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
    const { error, lat, lon, online } = this.state;

    return (
      <Container>
        {online === false && (
          <PopupTopBar type="error">
            You are offline.
          </PopupTopBar>
        )}

        <Title>Location</Title>
        <Text>lat: {lat}</Text>
        <Text>lon: {lon}</Text>

        {error && (
          <ErrorText>Error: {error}</ErrorText>
        )}
      </Container>
    );
  }
}

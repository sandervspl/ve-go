import React from 'react';
import { Text, NetInfo, ActivityIndicator, View, ListView } from 'react-native';
import * as c from './src/components/common';

import PopupTopBar from './src/components/common/PopupTopBar';

export default class App extends React.Component {
  constructor() {
    super();

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      lat: 0,
      lon: 0,
      error: null,
      online: null,
      loading: true,
      restaurantData: this.ds.cloneWithRows([]),
    };
  }

  async componentDidMount() {
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

  watchPositionSuccess = async ({ coords }) => {
    this.setState({
      lat: coords.latitude,
      lon: coords.longitude,
    });

    // this.setState({ loading: true });

    try {
      const response = await fetch(`http://192.168.2.60:8080/api/v1/vegan?lat=${coords.latitude}&lon=${coords.longitude}`);
      const data = await response.json();

      if (data.error) {
        console.error(data);
        this.setState({
          loading: false,
          error: data.error,
        });
      } else if (data.response && data.response.venues) {
        this.setState({
          restaurantData: this.ds.cloneWithRows(data.response.venues),
          loading: false,
        });
      }
    } catch (e) {
      console.error(e);
      this.setState({
        loading: false,
        error: e,
      });
    }
  };

  render() {
    const { error, online, loading, restaurantData } = this.state;

    return (
      <c.Main>
        <c.Container>
          {online === false && (
            <PopupTopBar type="error">
              You are offline.
            </PopupTopBar>
          )}

          <c.Header>
            <c.HugeTitle>Restaurants</c.HugeTitle>
          </c.Header>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <ListView
              dataSource={restaurantData}
              renderRow={(restaurant) => {
                if (!restaurant) return null;

                return (
                  <c.ListItem key={restaurant.id}>
                    <c.ListItemTitle>{restaurant.name}</c.ListItemTitle>
                    <c.ListItemText>
                      {restaurant.location.formattedAddress.reduce((fullAddress, address, i) => {
                        if (i === 0) return address;
                        return `${fullAddress}, ${address}`;
                      }, '')}
                    </c.ListItemText>
                    <c.ListItemText>
                      {restaurant.categories.reduce((list, category, i) => {
                        if (i === 0) return category.shortName;
                        return `${list}, ${category.shortName}`;
                      }, '')}
                    </c.ListItemText>
                    <c.ListItemText light>
                      {restaurant.location.distance} meter away
                    </c.ListItemText>
                  </c.ListItem>
                );
              }}
              enableEmptySections
            />
          )}

          {error && (
            <c.ErrorText>Error: {error}</c.ErrorText>
          )}
        </c.Container>
      </c.Main>
    );
  }
}

// dependencies
import React from 'react';
import { ListView, ActivityIndicator } from 'react-native';
import * as c from '../../common';

class App extends React.Component {
  constructor() {
    super();

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      lat: 0,
      lon: 0,
      error: null,
      loading: true,
      restaurantData: this.ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      this.watchPositionSuccess,
      this.watchPositionError,
      {
        timeout: 1000,
        enableHighAccuracy: true,
      },
    );
  }

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

    try {
      /* eslint-disable */
      const response = await fetch(
        `http://192.168.2.7:8080/api/v1/vegan?lat=${coords.latitude}&lon=${coords.longitude}`,
      );
      /* eslint-enable */
      const data = await response.json();

      if (data.error) {
        console.error(data);

        this.setState({
          loading: false,
          error: data.error,
        });
      } else if (data.response && data.response.venues) {
        /* eslint-disable */
        const sortedByDistance = data.response.venues.sort(
          (a, b) => a.location.distance > b.location.distance,
        );
        /* eslint-enable */

        this.setState({
          restaurantData: this.ds.cloneWithRows(sortedByDistance),
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
    const { error, loading, restaurantData } = this.state;

    return (
      <c.Container>
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
                    {restaurant.location.formattedAddress.reduce(
                      (fullAddress, address, i) => {
                        if (i === 0) return address;
                        return `${fullAddress}, ${address}`;
                      },
                      '',
                    )}
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

        {error && <c.ErrorText>Error: {error}</c.ErrorText>}
      </c.Container>
    );
  }
}

App.propTypes = {};

export default App;

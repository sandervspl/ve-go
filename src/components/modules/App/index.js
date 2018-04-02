// dependencies
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as c from '../../common';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      lat: 0,
      lon: 0,
      error: null,
      loading: true,
      restaurantData: [],
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
          restaurantData: sortedByDistance,
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

  handleScroll = (event) => {
    console.log('243y5rtythg');
    console.log(event);
  };

  render() {
    const { error, loading, restaurantData } = this.state;

    return (
      <c.ScrollContainer>
        <c.Header>
          <c.HugeTitle>Restaurants</c.HugeTitle>
        </c.Header>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <c.List>
            {restaurantData.length === 0 ? null : (
              restaurantData.map(restaurant => (
                <c.ListItem key={restaurant.id}>
                  <c.ListItemTitle>{restaurant.name}</c.ListItemTitle>
                  {restaurant.location.formattedAddress && (
                    <c.ListItemText>
                      {restaurant.location.formattedAddress.reduce(
                        (fullAddress, address, i) => {
                          if (i === 0) return address;
                          return `${fullAddress}, ${address}`;
                        },
                        '',
                      )}
                    </c.ListItemText>
                  )}
                  {restaurant.categories.length > 0 && (
                    <c.ListItemText>
                      {restaurant.categories.reduce((list, category, i) => {
                        if (i === 0) return category.shortName;
                        return `${list}, ${category.shortName}`;
                      }, '')}
                    </c.ListItemText>
                  )}
                  <c.ListItemText light>
                    {restaurant.location.distance} meter away
                  </c.ListItemText>
                </c.ListItem>
              ))
            )}
          </c.List>
        )}

        {error && <c.ErrorText>Error: {error}</c.ErrorText>}
      </c.ScrollContainer>
    );
  }
}

App.propTypes = {};

export default App;

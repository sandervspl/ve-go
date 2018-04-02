// dependencies
import React from 'react';
import PT from 'prop-types';
import { ActivityIndicator } from 'react-native';
import * as c from '../../../common';
import * as mc from './index';

class Overview extends React.Component {
  constructor() {
    super();

    this.state = {
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

  toDetailPage = (data) => {
    this.props.toDetailPage(this.props.navigator, data);
  };

  watchPositionSuccess = async ({ coords }) => {
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

  watchPositionError = (err) => {
    this.setState({
      error: err,
    });
  };

  render() {
    const { error, loading, restaurantData } = this.state;

    return (
      <c.ScrollContainer fullHeight={loading}>
        <c.Header>
          <c.HugeTitle>Restaurants</c.HugeTitle>
        </c.Header>

        {loading ? (
          <c.CenterView>
            <ActivityIndicator />
          </c.CenterView>
        ) : (
          <mc.RestaurantList data={restaurantData} toDetailPage={this.toDetailPage} />
        )}

        {error && <c.ErrorText>Error: {error}</c.ErrorText>}
      </c.ScrollContainer>
    );
  }
}

Overview.propTypes = {
  toDetailPage: PT.func.isRequired,
  navigator: PT.shape({}),
};

export default Overview;

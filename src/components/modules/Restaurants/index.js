// dependencies
import React from 'react';
import { ActivityIndicator } from 'react-native';
import * as c from '../../common';
import * as mc from './components';

class Restaurants extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: navigation.state.routeName,
      headerTitleStyle: {
        color: params && params.showTitle ? 'black' : 'transparent',
      },
    };
  };

  state = {
    error: null,
    loading: true,
    restaurantData: [],
  };

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
    // this.props.toDetailPage(this.props.navigator, data);
    this.props.navigation.navigate('Details', {
      data: data,
    });
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

  handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y >= 60) {
      this.props.navigation.setParams({ showTitle: true });
    } else {
      this.props.navigation.setParams({ showTitle: false });
    }
  };

  render() {
    const { error, loading, restaurantData } = this.state;

    return (
      <c.ScrollContainer fullHeight={loading} onScroll={(event) => { this.handleScroll(event); }} scrollEventThrottle={16}>
        <c.Header>
          <c.ContainerWithLine>
            <c.HugeTitle>Restaurants</c.HugeTitle>
          </c.ContainerWithLine>
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

// class Restaurants extends React.Component {
//   toDetailPage = (navigator, { id, name }) => {
//     navigator.push({
//       component: m.RestaurantDetail,
//       title: name,
//       passProps: { id },
//       leftButtonTitle: null,
//     });
//   };
//
//   render() {
//     return (
//       <NavigatorIOS
//         initialRoute={{
//           component: c.Overview,
//           title: 'Restaurants',
//           passProps: { toDetailPage: this.toDetailPage },
//         }}
//         style={{ flex: 1 }}
//         barTintColor="#ffffff"
//         shadowHidden
//         translucent
//       />
//     );
//   }
// }

Restaurants.propTypes = {};

export default Restaurants;

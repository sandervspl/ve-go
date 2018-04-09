import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import qs from 'qs';
import * as c from '../../common';
import * as mc from './components';
import { apiConfig } from '../../../helpers';

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
    lat: null,
    lon: null,
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

  async componentWillReceiveProps(nextProps) {
    // screen exit
    if (this.props.isFocused && !nextProps.isFocused) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
  };

  watchPositionSuccess = async ({ coords }) => {
    try {
      this.setState({ lat: coords.latitude, lon: coords.longitude });

      const queries = qs.stringify({
        lat: coords.latitude,
        lon: coords.longitude,
      });

      const response = await fetch(`${apiConfig.url}/vegan?${queries}`);
      const data = await response.json();

      if (data.error) {
        console.error(data);

        this.setState({
          loading: false,
          error: data.error,
        });
      } else {
        this.setState({
          restaurantData: data,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e);

      this.setState({
        loading: false,
        error: 'Something went wrong getting nearby restaurants.',
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
    const { error, loading, restaurantData, lat, lon } = this.state;

    return (
      <c.MainView>
        <c.ScrollContainer
          fullHeight={loading || restaurantData == null || restaurantData.length === 0}
          onScroll={(event) => { this.handleScroll(event); }}
          scrollEventThrottle={8}
        >
          <c.Header>
            <c.ContainerWithBorder>
              <c.HugeTitle>Restaurants</c.HugeTitle>
            </c.ContainerWithBorder>
          </c.Header>

          {loading ? (
            <c.CenterView>
              <ActivityIndicator />
            </c.CenterView>
          ) : (
            <mc.RestaurantList
              data={restaurantData}
              toDetailPage={this.toDetailPage}
              location={{ lat, lon }}
            />
          )}

          {error && (
            <c.CenterView>
              <Text>{error}</Text>
            </c.CenterView>
          )}
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

export default withNavigationFocus(Restaurants);

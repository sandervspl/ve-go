import React from 'react';
import { ActivityIndicator, Text, AppState, RefreshControl } from 'react-native';
import { Permissions, Location } from 'expo';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { connect } from 'react-redux';
import qs from 'qs';
import _ from 'lodash';
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
    appState: AppState.currentState,
  };

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // check if location permissions are granted
    const locPermission = await Permissions.getAsync(Permissions.LOCATION);

    // if not granted yet, we ask for permission
    if (locPermission.status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      // if granted, start location watching
      if (status === 'granted') {
        this.initLocationWatch();
      } else {
        // is not granted, or has been denied in the past
        // user has to give location permission in settings
        this.setState({
          loading: false,
          error: {
            emoji: '📍',
            text: 'Enable location services in your privacy settings to use Vegan Go.',
          },
        });
      }
    } else {
      this.initLocationWatch();
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { restaurantData, loading } = this.state;

    // screen exit -- stop locating
    if (this.props.isFocused && !nextProps.isFocused) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    // screen focus -- start locating
    if (!this.props.isFocused && nextProps.isFocused) {
      this.initLocationWatch();
    }

    // when no data is present and user is back online, fetch nearby restaurants
    if (!loading && restaurantData.length === 0 && !this.props.app.online && nextProps.app.online) {
      this.getNearbyRestaurants();
    }
  }

  // stop all activities
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    navigator.geolocation.clearWatch(this.watchId);
  }

  // store app state in component state when it changed
  getNearbyRestaurants = _.throttle(async () => {
    // do not execute API calls when locating is not ready or app is not active
    if (this.state.appState.match(/inactive|background/)) {
      return;
    }

    // check if app has location permissions
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    // notify user that location permissions are not granted
    if (status !== 'granted') {
      this.setState({
        loading: false,
        error: {
          emoji: '📍',
          text: 'Enable location services in your privacy settings to use Vegan Go.',
        },
      });
      return;
    }

    // if no location data is set, we will request it first.
    if (!this.state.lat || !this.state.lon) {
      const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      this.setState({ lat: coords.latitude, lon: coords.longitude }, this.fetchNearbyRestaurants);

      return;
    }

    this.fetchNearbyRestaurants();
  }, 10000);

  // start geolocation watcher
  initLocationWatch = () => {
    this.watchId = navigator.geolocation.watchPosition(
      this.watchPositionSuccess,
      this.watchPositionError,
      {
        timeout: 1000,
        enableHighAccuracy: true,
      },
    );
  };

  // get nearby venues with current location
  fetchNearbyRestaurants = async () => {
    try {
      this.setState({ loading: true, error: null });

      const { lat, lon } = this.state;
      const queries = qs.stringify({ lat, lon });
      const response = await fetch(`${apiConfig.url}/vegan?${queries}`);
      const data = await response.json();

      if (data.error) {
        console.log(data);

        this.setState({
          loading: false,
          error: {
            emoji: '☹️',
            text: 'Something went wrong getting nearby restaurants.',
          },
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
        error: {
          emoji: '☹️',
          text: 'Something went wrong getting nearby restaurants.',
        },
      });
    }
  };

  // values: active/inactive/background
  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  };

  // show/hide nav bar title after scrolling
  handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y >= 60) {
      this.props.navigation.setParams({ showTitle: true });
    } else {
      this.props.navigation.setParams({ showTitle: false });
    }
  };

  handleRefresh = () => {
    this.getNearbyRestaurants();
  };

  // geolocation error/success callbacks
  watchPositionError = (err) => {
    this.setState({ error: err });
  };

  watchPositionSuccess = async ({ coords }) => {
    this.setState({
      lat: coords.latitude,
      lon: coords.longitude,
    }, this.getNearbyRestaurants);
  };

  // navigate to detail page with data we already have
  // fetch all data on details page
  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
  };

  refreshController = () => (
    <RefreshControl
      refreshing={this.state.loading}
      onRefresh={this.handleRefresh}
    />
  );

  render() {
    const { error, loading, restaurantData, lat, lon } = this.state;

    return (
      <c.MainView>
        <c.ScrollContainer
          fullHeight={loading || restaurantData == null || restaurantData.length === 0}
          onScroll={(event) => { this.handleScroll(event); }}
          scrollEventThrottle={8}
          refreshControl={this.refreshController()}
        >
          <c.Header>
            <c.ContainerWithBorder>
              <c.HugeTitle>Restaurants</c.HugeTitle>
            </c.ContainerWithBorder>
          </c.Header>

          {restaurantData != null && (
            <mc.RestaurantList
              data={restaurantData}
              toDetailPage={this.toDetailPage}
              location={{ lat, lon }}
            />
          )}

          {error && (
            <c.CenterView>
              <c.Error>
                <c.Emoji>{error.emoji}</c.Emoji>
                <Text style={{ textAlign: 'center' }}>{error.text}</Text>
              </c.Error>
              <c.Button onPress={this.getNearbyRestaurants}>Retry</c.Button>
            </c.CenterView>
          )}
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
});

export default connect(mapStateToProps)(withNavigationFocus(Restaurants));

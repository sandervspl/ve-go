import React from 'react';
import { ActivityIndicator, Text, AppState } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { connect } from 'react-redux';
// import BackgroundGeolocation from 'react-native-background-geolocation';
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

  // eslint-disable-next-line
  locatingReady = false;

  state = {
    error: null,
    loading: true,
    restaurantData: [],
    lat: null,
    lon: null,
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    this.watchId = navigator.geolocation.watchPosition(
      this.watchPositionSuccess,
      this.watchPositionError,
      {
        timeout: 1000,
        enableHighAccuracy: true,
      },
    );

    // This handler fires whenever bgGeo receives a location update
    // BackgroundGeolocation.on('location', this.watchPositionSuccess, this.watchPositionError);

    // This event fires when a change in motion activity is detected
    // BackgroundGeolocation.on('activitychange', this.handleActivityChange);

    // BackgroundGeolocation.ready({
    //   // Geolocation Config
    //   desiredAccuracy: 0,
    //   distanceFilter: 10,
    //   // Activity Recognition
    //   stopTimeout: 1,
    //   // Application config
    //   debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    //   logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    //   stopOnTerminate: false, // Allow the background-service to continue tracking when user closes the app.
    //   startOnBoot: false, // Auto start tracking when device is powered-up.
    // }, (state) => {
    //   console.log('[BG] BackgroundGeolocation is configured and ready:', state.enabled);
    //
    //   if (!state.enabled) {
    //     // Start tracking
    //     BackgroundGeolocation.start(() => {
    //       console.log('[BG] Start success');
    //
    //       this.locatingReady = true;
    //       this.getNearbyRestaurants();
    //     });
    //   }
    // });
  }

  async componentWillReceiveProps(nextProps) {
    const { restaurantData, loading } = this.state;

    // screen exit
    if (this.props.isFocused && !nextProps.isFocused) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    if (!loading && restaurantData.length === 0 && !this.props.app.online && nextProps.app.online) {
      this.getNearbyRestaurants();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    navigator.geolocation.clearWatch(this.watchId);
    // BackgroundGeolocation.removeListeners();
  }

  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  };

  // handleActivityChange = (activity) => {
  //   // stop locating when moving fast
  //   if (activity === 'in_vehicle') {
  //     BackgroundGeolocation.removeListener('location');
  //   }
  //
  //   // start locating when moving slowly
  //   if (activity === 'on_foot') {
  //     BackgroundGeolocation.on('location', this.watchPositionSuccess);
  //   }
  // };

  getNearbyRestaurants = _.throttle(async () => {
    // do not execute API calls when locating is not ready or app is not active
    if (this.state.appState.match(/inactive|background/)/* || !this.locatingReady*/) {
      return;
    }

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
  }, 10000);

  handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y >= 60) {
      this.props.navigation.setParams({ showTitle: true });
    } else {
      this.props.navigation.setParams({ showTitle: false });
    }
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
    }, this.getNearbyRestaurants);
  };

  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
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
              <c.Error>
                <c.Emoji>{error.emoji}</c.Emoji>
                <Text>{error.text}</Text>
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

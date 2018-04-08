import React from 'react';
import { NetInfo } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import { Ionicons } from '@expo/vector-icons';
import * as c from './src/components/common';
import * as m from './src/components/modules';
import * as s from './src/components/common/styles';

const headerStyle = {
  backgroundColor: '#FFFFFF',
  elevation: 0,
  borderBottomWidth: 0,
};

const RestaurantsStack = StackNavigator({
  Restaurants: { screen: m.Restaurants },
  Details: { screen: m.RestaurantDetail },
}, {
  navigationOptions: {
    headerStyle,
  },
});

const SearchStack = StackNavigator({
  Search: { screen: m.Search },
  Details: { screen: m.RestaurantDetail },
}, {
  navigationOptions: { headerStyle },
});

const FavoritesStack = StackNavigator({
  Favorites: { screen: m.Favorites },
  Details: { screen: m.RestaurantDetail },
}, {
  navigationOptions: { headerStyle },
});

const AppNavigator = TabNavigator({
  Nearby: { screen: RestaurantsStack },
  Search: { screen: SearchStack },
  Favorites: { screen: FavoritesStack },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;

      switch (routeName) {
        case 'Nearby': iconName = `ios-pin${focused ? '' : '-outline'}`; break;
        case 'Favorites': iconName = `ios-restaurant${focused ? '' : '-outline'}`; break;
        case 'Search': iconName = `ios-search${focused ? '' : '-outline'}`; break;
        default: iconName = `ios-help-circle${focused ? '' : '-outline'}`;
      }

      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
    title: navigation.state.routeName,
  }),
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: s.color.green,
    inactiveTintColor: 'gray',
  },
  animationEnabled: false,
  swipeEnabled: false,
});

export default class App extends React.Component {
  state = {
    online: null,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.onConnectionChange,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.onConnectionChange,
    );
  }

  onConnectionChange = (connected) => {
    this.setState({
      online: connected,
    });
  };

  onNavigation = (prevState, curState) => updateFocus(curState);

  render() {
    const { online } = this.state;

    return (
      <React.Fragment>
        {online === false && (
          <c.PopupTopBar type="error">You are offline.</c.PopupTopBar>
        )}

        <AppNavigator onNavigationStateChange={this.onNavigation} />
      </React.Fragment>
    );
  }
}

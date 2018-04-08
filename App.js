import React from 'react';
import { NetInfo } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import { Ionicons } from '@expo/vector-icons';
import * as m from './src/components/modules';

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

const FavoritesStack = StackNavigator({
  Favorites: { screen: m.Favorites },
  Details: { screen: m.RestaurantDetail },
}, {
  navigationOptions: { headerStyle },
});

const AppNavigator = TabNavigator({
  Nearby: { screen: RestaurantsStack },
  Favorites: { screen: FavoritesStack },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Nearby') {
        iconName = `ios-pin${focused ? '' : '-outline'}`;
      } else if (routeName === 'Favorites') {
        iconName = `ios-restaurant${focused ? '' : '-outline'}`;
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
    activeTintColor: '#5bc73f',
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

  render() {
    const { online } = this.state;

    return (
      <AppNavigator onNavigationStateChange={(prevState, curState) => updateFocus(curState)} />
    );
  }
}

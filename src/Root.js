// dependencies
import React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { updateFocus } from 'react-navigation-is-focused-hoc';
import { Ionicons } from '@expo/vector-icons';
import { setOnlineState } from './ducks/modules/app';
import * as s from './components/common/styles';
import * as c from './components/common';
import * as m from './components/modules';

const headerStyle = {
  backgroundColor: '#FFFFFF',
  elevation: 0,
  borderBottomWidth: 0,
};

const RestaurantsStack = StackNavigator(
  {
    Restaurants: { screen: m.Restaurants },
    Details: { screen: m.RestaurantDetail },
  },
  {
    navigationOptions: {
      headerStyle,
    },
  },
);

const SearchStack = StackNavigator(
  {
    Search: { screen: m.Search },
    Details: { screen: m.RestaurantDetail },
  },
  {
    navigationOptions: { headerStyle },
  },
);

const FavoritesStack = StackNavigator(
  {
    Favorites: { screen: m.Favorites },
    Details: { screen: m.RestaurantDetail },
  },
  {
    navigationOptions: { headerStyle },
  },
);

const AppNavigator = TabNavigator(
  {
    Nearby: { screen: RestaurantsStack },
    Search: { screen: SearchStack },
    Favorites: { screen: FavoritesStack },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;

        switch (routeName) {
          case 'Nearby':
            iconName = `ios-pin${focused ? '' : '-outline'}`;
            break;
          case 'Favorites':
            iconName = `ios-restaurant${focused ? '' : '-outline'}`;
            break;
          case 'Search':
            iconName = `ios-search${focused ? '' : '-outline'}`;
            break;
          default:
            iconName = `ios-help-circle${focused ? '' : '-outline'}`;
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
  },
);

class Root extends React.Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.onConnectionChange);
  }

  onConnectionChange = connected => {
    this.props.setOnlineState(connected);
  };

  onNavigation = (prevState, curState) => updateFocus(curState);

  render() {
    const { online } = this.props.app;

    return (
      <React.Fragment>
        {online === false && <c.PopupTopBar type="error">You are offline.</c.PopupTopBar>}

        <AppNavigator onNavigationStateChange={this.onNavigation} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app,
});

export default connect(mapStateToProps, { setOnlineState })(Root);

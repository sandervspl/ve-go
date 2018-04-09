import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import * as s from './components/common/styles';
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

export default TabNavigator(
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

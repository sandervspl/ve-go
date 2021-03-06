import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import theme from './style/theme';
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

const SavedStack = StackNavigator(
  {
    Saved: { screen: m.Saved },
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
    Saved: { screen: SavedStack },
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
          case 'Saved':
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
      activeTintColor: theme.color.green,
      inactiveTintColor: 'gray',
    },
    animationEnabled: false,
    swipeEnabled: false,
  },
);

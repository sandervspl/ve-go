import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
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

export default TabNavigator({
  Restaurants: { screen: RestaurantsStack },
  Favorites: { screen: FavoritesStack },
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Restaurants') {
        iconName = `ios-list-box${focused ? '' : '-outline'}`;
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

// export default class App extends React.Component {
//   state = {
//     online: null,
//     activeTab: 1,
//   };
//
//   componentDidMount() {
//     NetInfo.isConnected.addEventListener(
//       'connectionChange',
//       this.onConnectionChange,
//     );
//   }
//
//   componentWillUnmount() {
//     NetInfo.isConnected.removeEventListener(
//       'connectionChange',
//       this.onConnectionChange,
//     );
//   }
//
//   onConnectionChange = (connected) => {
//     this.setState({
//       online: connected,
//     });
//   };
//
//   switchToTab = (id) => {
//     this.setState({
//       activeTab: id,
//     });
//   };
//
//   render() {
//     const { online, activeTab } = this.state;
//
//     return (
//       <c.Main>
//         {online === false && (
//           <c.PopupTopBar type="error">You are offline.</c.PopupTopBar>
//         )}
//
//         <TabBarIOS>
//           <TabBarIOS.Item
//             selected={activeTab === 1}
//             onPress={() => this.switchToTab(1)}
//             systemIcon="search"
//             style={{ marginBottom: 50 }}
//           >
//             <m.Restaurants />
//           </TabBarIOS.Item>
//           <TabBarIOS.Item
//             selected={activeTab === 2}
//             onPress={() => this.switchToTab(2)}
//             systemIcon="favorites"
//           >
//             <m.Favorites />
//           </TabBarIOS.Item>
//         </TabBarIOS>
//       </c.Main>
//     );
//   }
// }

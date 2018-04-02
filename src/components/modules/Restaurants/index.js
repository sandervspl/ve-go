// dependencies
import React from 'react';
import { NavigatorIOS } from 'react-native';
import * as c from './components';
import * as m from '../index';

class App extends React.Component {
  toDetailPage = (navigator, { id, name }) => {
    navigator.push({
      component: m.RestaurantDetail,
      title: name,
      passProps: { id },
      leftButtonTitle: null,
    });
  };

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: c.Overview,
          title: 'Restaurants',
          passProps: { toDetailPage: this.toDetailPage },
        }}
        style={{ flex: 1 }}
        barTintColor="#ffffff"
        shadowHidden
        translucent
      />
    );
  }
}

App.propTypes = {};

export default App;

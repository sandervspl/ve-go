import React from 'react';
import { NetInfo, TabBarIOS, NavigatorIOS } from 'react-native';
import * as m from './src/components/modules';
import * as c from './src/components/common';
import PopupTopBar from './src/components/common/PopupTopBar';

export default class App extends React.Component {
  state = {
    online: null,
    activeTab: 1,
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

  switchToTab = (id) => {
    this.setState({
      activeTab: id,
    });
  };

  render() {
    const { online, activeTab } = this.state;

    return (
      <c.Main>
        {online === false && (
          <PopupTopBar type="error">You are offline.</PopupTopBar>
        )}

        <TabBarIOS>
          <TabBarIOS.Item
            selected={activeTab === 1}
            onPress={() => this.switchToTab(1)}
            systemIcon="search"
            style={{ marginBottom: 50 }}
          >
            <NavigatorIOS
              initialRoute={{
                component: m.App,
                title: 'Restaurants',
              }}
              style={{ flex: 1 }}
              barTintColor="#ffffff"
              shadowHidden
              translucent
              titleTextColor="rgba(0,0,0,0)"
            />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            selected={activeTab === 2}
            onPress={() => this.switchToTab(2)}
            systemIcon="favorites"
          >
            <m.Favorites />
          </TabBarIOS.Item>
        </TabBarIOS>
      </c.Main>
    );
  }
}

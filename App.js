import React from 'react';
import { NetInfo, TabBarIOS } from 'react-native';
import * as m from './src/components/modules';
import * as c from './src/components/common';

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
          <c.PopupTopBar type="error">You are offline.</c.PopupTopBar>
        )}

        <TabBarIOS>
          <TabBarIOS.Item
            selected={activeTab === 1}
            onPress={() => this.switchToTab(1)}
            systemIcon="search"
            style={{ marginBottom: 50 }}
          >
            <m.Restaurants />
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

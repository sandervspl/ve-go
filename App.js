import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import Root from './src/Root';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;

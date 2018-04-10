import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import store from './src/store';
import Root from './src/Root';
import theme from './src/style/theme';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Root />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;

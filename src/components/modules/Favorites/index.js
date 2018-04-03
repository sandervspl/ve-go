import React from 'react';
import * as c from '../../common';

class Favorites extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.routeName,
  });

  render() {
    return (
      <c.ScrollContainer>
        <c.Header>
          <c.ContainerWithBorder>
            <c.HugeTitle>Favorites</c.HugeTitle>
          </c.ContainerWithBorder>
        </c.Header>
      </c.ScrollContainer>
    );
  }
}

Favorites.propTypes = {};

export default Favorites;

import React from 'react';
import { Text } from 'react-native';
import PT from 'prop-types';
import * as c from '../../common';

class RestaurantDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params.data.name,
    };
  };

  render() {
    return (
      <c.ScrollContainer fullHeight>
        <c.CenterView>
          <Text>{this.props.navigation.state.params.data.name}</Text>
        </c.CenterView>
      </c.ScrollContainer>
    );
  }
}

RestaurantDetail.propTypes = {};

export default RestaurantDetail;

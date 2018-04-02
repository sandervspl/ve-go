import React from 'react';
import { Text } from 'react-native';
import PT from 'prop-types';
import * as c from '../../common';

const RestaurantDetail = () => (
  <c.ScrollContainer fullHeight>
    <c.CenterView>
      <Text>Its lit 🔥</Text>
    </c.CenterView>
  </c.ScrollContainer>
);

RestaurantDetail.propTypes = {};

export default RestaurantDetail;

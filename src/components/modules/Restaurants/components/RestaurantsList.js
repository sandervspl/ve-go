import React from 'react';
import PT from 'prop-types';
import * as c from '../../../common';
import ListItem from './RestaurantListItem';

const RestaurantsList = ({ data, onTouchRestaurant }) => (
  <c.List>
    {data.length === 0 ? null : (
      data.map(restaurant => (
        <ListItem
          key={restaurant.id}
          data={restaurant}
          onPress={onTouchRestaurant}
        />
      ))
    )}
  </c.List>
);

RestaurantsList.propTypes = {
  data: PT.arrayOf(PT.object).isRequired,
  onTouchRestaurant: PT.func.isRequired,
};

export default RestaurantsList;

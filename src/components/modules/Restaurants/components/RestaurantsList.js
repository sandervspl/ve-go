import React from 'react';
import PT from 'prop-types';
import * as c from '../../../common';
import ListItem from './RestaurantListItem';

const RestaurantsList = ({ data, toDetailPage }) => {
  return (
    <c.List>
      {data.length === 0 ? null : (
        data.map(restaurant => (
          <ListItem
            key={restaurant.id}
            data={restaurant}
            onPress={toDetailPage}
          />
        ))
      )}
    </c.List>
  );
}

RestaurantsList.propTypes = {
  data: PT.arrayOf(PT.object).isRequired,
  toDetailPage: PT.func.isRequired,
};

export default RestaurantsList;

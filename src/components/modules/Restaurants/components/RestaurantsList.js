import React from 'react';
import PT from 'prop-types';
import * as c from '../../../common';
import ListItem from './RestaurantListItem';

const RestaurantsList = ({ data, toDetailPage, location }) => {
  return (
    <c.List>
      {data.length === 0 ? null : (
        data.map(restaurant => (
          <ListItem
            key={restaurant.place_id}
            data={restaurant}
            onPress={toDetailPage}
            location={location}
          />
        ))
      )}
    </c.List>
  );
};

RestaurantsList.propTypes = {
  data: PT.arrayOf(PT.object).isRequired,
  toDetailPage: PT.func.isRequired,
};

export default RestaurantsList;

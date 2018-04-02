import React from 'react';
import PT from 'prop-types';
import * as c from '../../../common';

const RestaurantsList = ({ data }) => (
  <c.List>
    {data.length === 0 ? null : (
      data.map(restaurant => (
        <c.ListItem key={restaurant.id}>
          <c.ListItemTitle>{restaurant.name}</c.ListItemTitle>
          {restaurant.location.formattedAddress && (
            <c.ListItemText>
              {restaurant.location.formattedAddress.reduce(
                (fullAddress, address, i) => {
                  if (i === 0) return address;
                  return `${fullAddress}, ${address}`;
                },
                '',
              )}
            </c.ListItemText>
          )}
          {restaurant.categories.length > 0 && (
            <c.ListItemText>
              {restaurant.categories.reduce((list, category, i) => {
                if (i === 0) return category.shortName;
                return `${list}, ${category.shortName}`;
              }, '')}
            </c.ListItemText>
          )}
          <c.ListItemText light>
            {restaurant.location.distance} meter away
          </c.ListItemText>
        </c.ListItem>
      ))
    )}
  </c.List>
);

RestaurantsList.propTypes = {
  data: PT.arrayOf(PT.object),
};

export default RestaurantsList;

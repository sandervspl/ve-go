import React from 'react';
import PT from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import * as c from '../../../common';

class RestaurantListItem extends React.Component {
  state = {
    pressed: false,
  };

  handlePressIn = () => this.setState({ pressed: true });

  handlePressOut = () => {
    this.setState({ pressed: false });
  };

  handlePress = () => {
    const { data, onPress } = this.props;
    this.setState({ pressed: false }, () => onPress(data));
  };

  render() {
    const { data } = this.props;
    const { pressed } = this.state;

    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onPress={this.handlePress}
      >
        <c.ListItem pressed={pressed}>
          <c.ContainerWithLine paddingBottom={5}>
            <c.ListItemTitle pressed={pressed}>
              {data.name}
            </c.ListItemTitle>

            {data.location.formattedAddress && (
              <c.ListItemText pressed={pressed}>
                {data.location.formattedAddress.reduce(
                  (fullAddress, address, i) => {
                    if (i === 0) return address;
                    return `${fullAddress}, ${address}`;
                  },
                  '',
                )}
              </c.ListItemText>
            )}

            {data.categories.length > 0 && (
              <c.ListItemText pressed={pressed}>
                {data.categories.reduce((list, category, i) => {
                  if (i === 0) return category.shortName;
                  return `${list}, ${category.shortName}`;
                }, '')}
              </c.ListItemText>
            )}

            <c.ListItemText light={!pressed} pressed={pressed}>
              {data.location.distance} meter away
            </c.ListItemText>
          </c.ContainerWithLine>
        </c.ListItem>
      </TouchableWithoutFeedback>
    );
  }
}

RestaurantListItem.propTypes = {
  data: PT.shape({
    id: PT.string,
    location: PT.shape({
      formattedAddress: PT.array,
    }),
    categories: PT.arrayOf(PT.shape({
      shortName: PT.string,
    })),
  }).isRequired,
  onPress: PT.func.isRequired,
};

export default RestaurantListItem;

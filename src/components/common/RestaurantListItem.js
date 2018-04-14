import React from 'react';
import PT from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import * as c from './index';
import theme from '../../style/theme';
import { getDistanceFromLatLonInM } from '../../helpers';

export class RestaurantListItem extends React.Component {
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
    const { data, location } = this.props;
    const { pressed } = this.state;
    const isOpen = data.opening_hours && data.opening_hours.open_now;

    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onPress={this.handlePress}
      >
        <c.ListItem pressed={pressed}>
          <c.ContainerWithBorder paddingBottom={5}>
            <c.ListItemTitle pressed={pressed}>{data.name}</c.ListItemTitle>

            {data.vicinity && <c.ListItemText pressed={pressed}>{data.vicinity}</c.ListItemText>}

            {location && data.geometry && data.geometry.location && (
              <c.ListItemText pressed={pressed}>
                {getDistanceFromLatLonInM(
                  data.geometry.location.lat,
                  data.geometry.location.lng,
                  location.lat,
                  location.lon,
                )} meter away
              </c.ListItemText>
            )}

            {data.opening_hours && data.opening_hours.open_now != null && (
              <c.ListItemText
                pressed={pressed}
                green={!pressed && isOpen}
                red={!pressed && !isOpen}
              >
                {isOpen ? 'Open' : 'Closed'}
              </c.ListItemText>
            )}
          </c.ContainerWithBorder>
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
  location: PT.shape({
    lat: PT.number,
    lon: PT.number,
  }),
};

import React from 'react';
import PT from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import * as c from '../../../common';

class RestaurantListItem extends React.Component {
  state = {
    pressed: false,
  };

  getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
      (Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2));
    const cc = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * cc; // Distance in km

    return Math.floor(d * 1000); // return distance in m
  };

  deg2rad = deg => deg * (Math.PI / 180);

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

            {data.geometry && data.geometry.location && (
              <c.ListItemText pressed={pressed}>
                {this.getDistanceFromLatLonInM(
                  data.geometry.location.lat,
                  data.geometry.location.lng,
                  location.lat,
                  location.lon,
                )} meter away
              </c.ListItemText>
            )}

            {data.opening_hours && data.opening_hours.open_now != null && (
              <c.ListItemText light={!pressed} pressed={pressed}>
                {data.opening_hours.open_now ? 'Open' : 'Closed'}
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
    categories: PT.arrayOf(
      PT.shape({
        shortName: PT.string,
      }),
    ),
  }).isRequired,
  onPress: PT.func.isRequired,
  location: PT.shape({
    lat: PT.number,
    lon: PT.number,
  }),
};

export default RestaurantListItem;

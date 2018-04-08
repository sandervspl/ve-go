import React from 'react';
import { ActivityIndicator } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import * as c from '../../common';
import { asyncStorage } from '../../../helpers';
import RestaurantListItem from '../Restaurants/components/RestaurantListItem';

class Favorites extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.routeName,
  });

  state = {
    loading: false,
    favorites: null,
  };

  async componentDidMount() {
    const favorites = await asyncStorage.getFavorites();
    this.setState({ favorites });
  }

  async componentWillReceiveProps(nextProps) {
    // screen enter -- refresh data
    if (!this.props.isFocused && nextProps.isFocused) {
      const favorites = await asyncStorage.getFavorites();
      this.setState({ favorites });
    }
  }

  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
  };

  render() {
    const { favorites, loading } = this.state;

    return (
      <c.MainView>
        <c.ScrollContainer>
          <c.Header>
            <c.ContainerWithBorder>
              <c.HugeTitle>Favorites</c.HugeTitle>
            </c.ContainerWithBorder>
          </c.Header>

          {loading ? (
            <c.CenterView>
              <ActivityIndicator />
            </c.CenterView>
          ) : (
            <c.List>
              {favorites && favorites.map(fav => (
                <RestaurantListItem
                  key={fav.place_id}
                  data={fav}
                  onPress={this.toDetailPage}
                />
              ))}
            </c.List>
          )}
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

Favorites.propTypes = {};

export default withNavigationFocus(Favorites);

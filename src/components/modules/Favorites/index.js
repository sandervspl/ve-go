import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import * as c from '../../common';
import { asyncStorage } from '../../../helpers';

class Favorites extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.routeName,
  });

  state = {
    loading: false,
    favorites: null,
  };

  componentDidMount() {
    this.getFavorites();
  }

  componentWillReceiveProps(nextProps) {
    // screen enter -- refresh data
    if (!this.props.isFocused && nextProps.isFocused) {
      this.getFavorites();
    }
  }

  getFavorites = () => {
    this.setState({
      favorites: null,
      loading: true,
    }, async () => {
      const favorites = await asyncStorage.getFavorites();

      this.setState({
        favorites,
        loading: false,
      });
    });
  };

  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
  };

  render() {
    const { favorites, loading } = this.state;
    const noFavorites = !favorites || favorites.length === 0;

    return (
      <c.MainView>
        <c.ScrollContainer fullHeight={noFavorites}>
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
              {!noFavorites && favorites.map(fav => (
                <c.RestaurantListItem
                  key={fav.place_id}
                  data={fav}
                  onPress={this.toDetailPage}
                />
              ))}
            </c.List>
          )}

          {!loading && noFavorites && (
            <c.CenterView>
              <Text>
                No favorites yet. Go 💚 a place!
              </Text>
            </c.CenterView>
          )}
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

Favorites.propTypes = {};

export default withNavigationFocus(Favorites);

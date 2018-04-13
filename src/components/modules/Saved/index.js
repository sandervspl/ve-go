import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import * as c from '../../common';
import { asyncStorage } from '../../../helpers';

class Saved extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.routeName,
  });

  state = {
    loading: false,
    saved: null,
  };

  componentDidMount() {
    this.getSaved();
  }

  componentWillReceiveProps(nextProps) {
    // screen enter -- refresh data
    if (!this.props.isFocused && nextProps.isFocused) {
      this.getSaved();
    }
  }

  getSaved = () => {
    this.setState({
      saved: null,
      loading: true,
    }, async () => {
      const saved = await asyncStorage.getSaved();

      this.setState({
        saved,
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
    const { saved, loading } = this.state;
    const noSaved = !saved || saved.length === 0;

    return (
      <c.MainView>
        <c.ScrollContainer fullHeight={noSaved}>
          <c.Header>
            <c.ContainerWithBorder>
              <c.HugeTitle>Saved</c.HugeTitle>
            </c.ContainerWithBorder>
          </c.Header>

          {loading ? (
            <c.CenterView>
              <ActivityIndicator />
            </c.CenterView>
          ) : (
            <c.List>
              {!noSaved && saved.map(fav => (
                <c.RestaurantListItem
                  key={fav.place_id}
                  data={fav}
                  onPress={this.toDetailPage}
                />
              ))}
            </c.List>
          )}

          {!loading && noSaved && (
            <c.CenterView>
              <Text>
                No saved restaurants yet. Go 💚 a place!
              </Text>
            </c.CenterView>
          )}
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

Saved.propTypes = {};

export default withNavigationFocus(Saved);

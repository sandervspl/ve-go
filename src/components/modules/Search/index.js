import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { connect } from 'react-redux';
import _ from 'lodash';
import qs from 'qs';
import * as c from '../../common';
import { GOOGLE_MAPS_KEY } from '../../../secret';
import { apiConfig } from '../../../helpers';

class Search extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.routeName,
  });

  state = {
    loading: false,
    address: null,
    results: null,
    value: '',
    error: null,
  };

  componentWillReceiveProps(nextProps) {
    const { loading, results } = this.state;

    if (!loading && results == null && !this.props.app.online && nextProps.app.online) {
      this.search(nextProps);
    }
  }

  toDetailPage = (data) => {
    const { lat, lon } = this.state;

    this.props.navigation.navigate('Details', {
      preFetchData: data,
      location: { lat, lon },
    });
  };

  search = _.debounce(async (props = this.props) => {
    if (!props.app.online) {
      this.setState({
        results: null,
        error: {
          emoji: '☹️',
          text: 'Cannot search while offline.',
          retry: true,
        },
      });

      return;
    }

    const { value } = this.state;

    if (!value) {
      return;
    }

    try {
      // reset any previous data
      this.setState({
        results: null,
        address: null,
        error: null,
        loading: true,
      });

      // fetch coordinates for input value
      const uri = 'https://maps.googleapis.com/maps/api/geocode/json';
      let response = await fetch(`${uri}?address=${value}&key=${GOOGLE_MAPS_KEY}`);
      const result = await response.json();

      let data = result.results[0];

      if (data == null) {
        this.setState({
          loading: false,
          error: {
            emoji: '🤷🏻‍♂',
            text: '️Unable to find that address.',
          },
        });

        return;
      }

      // show the user where the search is happening as soon as possible
      this.setState({ address: data.formatted_address });

      // fetch all vegan venues for this location
      const { location } = data.geometry;
      const queries = qs.stringify({
        lat: location.lat,
        lon: location.lng,
      });

      response = await fetch(`${apiConfig.url}/vegan?${queries}`);
      data = await response.json();

      if (data.error) {
        this.setState({ loading: false });
      } else {
        this.setState({
          results: data,
          loading: false,
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
        error: {
          emoji: '☹️',
          text: 'Error while loading results.',
        },
      });
      console.log(e);
    }
  }, 500);

  handleOnChange = (value) => {
    this.setState({ value }, this.search);
  };

  render() {
    const { results, loading, value, address, error } = this.state;

    return (
      <c.MainView>
        <c.ScrollContainer fullHeight={results == null}>
          <c.Header>
            <c.HugeTitle>Search</c.HugeTitle>
          </c.Header>

          <c.PaddedView>
            <c.TextInput
              value={value}
              onChangeText={this.handleOnChange}
              placeholder="Vegan restaurants in cities"
              style={{ marginBottom: 10 }}
            />

            {address != null && <c.SmallTitle>Results for {address}</c.SmallTitle>}
          </c.PaddedView>

          {error && (
            <c.CenterView>
              <c.Error>
                <c.Emoji big>{error.emoji}</c.Emoji>
                <Text>{error.text}</Text>
              </c.Error>
              {error.retry && <c.Button onPress={this.search}>Retry</c.Button>}
            </c.CenterView>
          )}

          {loading ? (
            <c.CenterView>
              <ActivityIndicator />
            </c.CenterView>
          ) : (
            <c.List>
              {results != null && results.map(item => (
                <c.RestaurantListItem
                  key={item.place_id}
                  data={item}
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

const mapStateToProps = state => ({
  app: state.app,
});

export default connect(mapStateToProps)(withNavigationFocus(Search));

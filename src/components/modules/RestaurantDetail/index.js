import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import PT from 'prop-types';
import * as c from '../../common';
import * as mc from './components';
import { apiConfig } from '../../../helpers';
import DefaultImage from '../../../static/images/default-header-image.jpg';

class RestaurantDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params.preFetchData.name,
    };
  };

  state = {
    loading: false,
    data: null,
    menu: null,
    photoUrl: null,
    photoLoading: false,
  };

  async componentDidMount() {
    const { preFetchData } = this.props.navigation.state.params;

    this.setState({ loading: true });

    // fetch venue information
    const venueResponse = await fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.place_id}`);
    const venueData = await venueResponse.json();

    this.setState({
      loading: false,
      data: venueData,
    });

    // fetch venue photos with reference
    if (venueData.photos && venueData.photos[0]) {
      this.setState({
        photoLoading: true,
      });

      const photosResponse = await fetch(`${apiConfig.url}/vegan/restaurant/photo/${venueData.photos[0].photo_reference}`);
      const photoData = await photosResponse.json();

      this.setState({
        photoUrl: photoData.url,
        photoLoading: false,
      });
    }
  }

  getPriceLevelString = (level) => {
    switch (level) {
      case 0: return 'Free';
      case 1: return '$';
      case 2: return '$$';
      case 3: return '$$$';
      case 4: return '$$$$';
      default: return 'No price level';
    }
  };

  render() {
    const { loading, photoLoading, data, menu, photoUrl } = this.state;
    const { preFetchData } = this.props.navigation.state.params;
    const photoSrc = photoUrl != null
      ? { uri: photoUrl }
      : DefaultImage;
    const isOpen = preFetchData.opening_hours && preFetchData.opening_hours.open_now;

    return (
      <c.MainView height="100%">
        <c.ScrollContainer>
          <mc.BigImageHeaderContainer>
            <mc.InnerImageContainer>
              {!photoLoading && !loading ? (
                <mc.BigImage
                  source={photoSrc}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <c.CenterView>
                  <ActivityIndicator />
                </c.CenterView>
              )}
            </mc.InnerImageContainer>

            {data != null && (
              <mc.CollageContainer>
                <mc.CollageBlock right bottom>
                  <mc.CollageText>
                    {data.rating ? `${data.rating} / 5` : 'No rating'}
                  </mc.CollageText>
                </mc.CollageBlock>
                <mc.CollageBlock bottom>
                  <mc.CollageText isClosed={!isOpen}>
                    {isOpen ? 'Open' : 'Closed'}
                  </mc.CollageText>
                </mc.CollageBlock>
                <mc.CollageBlock right>
                  <mc.CollageText>
                    {data.price_level ? this.getPriceLevelString(data.price_level) : 'No price level'}
                  </mc.CollageText>
                </mc.CollageBlock>
                <mc.CollageBlock />
              </mc.CollageContainer>
            )}
          </mc.BigImageHeaderContainer>

          <View style={{ padding: 20, width: '100%' }}>
            <c.BigTitle>
              {preFetchData.name}
            </c.BigTitle>

            {data == null ? (
              <c.CenterView>
                <ActivityIndicator />
              </c.CenterView>
            ) : (
              <View>
                <Text>{data.vicinity}</Text>
                {data.formatted_phone_number && <Text>{data.formatted_phone_number}</Text>}
                {data.url && <Text>{data.url} {/* REQUIRED */}</Text>}
                {data.website && <Text>{data.website}</Text>}
                {data.types && data.types.length > 0 && (
                  <Text>
                    {data.types.reduce((list, type, i) => {
                      const replaceUnderscore = str => str.replace(/_/g, ' ');

                      if (i === 0) return replaceUnderscore(type);
                      return `${list}, ${replaceUnderscore(type)}`;
                    }, '')}
                  </Text>
                )}
              </View>
            )}

            <View>
              <c.Title>Menu</c.Title>

              {menu == null || !menu.menus || menu.menus.count === 0 ? (
                <Text>No menu information available.</Text>
              ) : (
                <Text>[TODO] Menu available! Show it!</Text>
              )}
            </View>

            <View>
              <c.Title>Reviews</c.Title>

              <Text>[TODO]</Text>
            </View>

            {data != null && data.code >= 300 && (
              <c.ErrorText>
                {data.errorDetail}
              </c.ErrorText>
            )}
          </View>
        </c.ScrollContainer>
      </c.MainView>
    );
  }
}

RestaurantDetail.propTypes = {
  navigation: PT.shape({
    state: PT.shape({
      params: PT.shape({
        preFetchData: PT.shape({
          id: PT.string,
          name: PT.string,
        }),
      }),
    }),
  }),
};

export default RestaurantDetail;

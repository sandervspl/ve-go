import React from 'react';
import PT from 'prop-types';
import { ActivityIndicator, Linking } from 'react-native';
import call from 'react-native-phone-call';
import * as c from '../../common';
import * as mc from './components';
import { apiConfig, asyncStorage } from '../../../helpers';
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
    photoUrl: null,
    photoLoading: false,
    saved: null,
  };

  async componentDidMount() {
    try {
      const { preFetchData } = this.props.navigation.state.params;

      this.setState({ loading: true });

      // fetch venue information
      const venueResponse = await fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.place_id}`);
      const venueData = await venueResponse.json();
      let saved = false;

      // check if venue is saved as favorite
      if (await asyncStorage.isFavorited(venueData.place_id)) {
        saved = true;
      }

      this.setState({
        loading: false,
        data: venueData,
        saved,
      });

      // fetch venue photos with reference
      if (venueData.photos && venueData.photos[0]) {
        try {
          this.setState({
            photoLoading: true,
          });

          const photosResponse = await fetch(`${apiConfig.url}/vegan/restaurant/photo/${venueData.photos[0].photo_reference}`);
          const photoData = await photosResponse.json();

          this.setState({
            photoUrl: photoData.url,
            photoLoading: false,
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  onMapsClick = () => {
    Linking.openURL(this.state.data.url)
      .catch(e => console.error(e));
  };

  onWebsiteClick = () => {
    Linking.openURL(this.state.data.website)
      .catch(e => console.error(e));
  };

  onPhoneClick = () => {
    call({ number: this.state.data.formatted_phone_number, prompt: true })
      .catch(e => console.error(e));
  };

  onFavoriteClick = async () => {
    // eslint-disable-next-line
    const { place_id } = this.state.data;
    const isFavorited = await asyncStorage.isFavorited(place_id);

    if (!isFavorited) {
      const saved = await asyncStorage.favorite(place_id);

      if (saved) {
        this.setState({ saved });
      }
    } else {
      const saved = await asyncStorage.unfavorite(place_id);

      if (saved) {
        this.setState({ saved: !saved });
      }
    }
  };

  render() {
    const { loading, photoLoading, data, photoUrl, saved } = this.state;
    const { preFetchData, location } = this.props.navigation.state.params;
    const photoSrc = photoUrl != null
      ? { uri: photoUrl }
      : DefaultImage;

    return (
      <c.MainView height="100%">
        <c.ScrollContainer>
          <mc.RatingCircle
            data={data}
            loading={loading}
            preData={preFetchData}
            onWebsiteClick={this.onWebsiteClick}
            onPhoneClick={this.onPhoneClick}
            onFavoriteClick={this.onFavoriteClick}
            saved={saved}
          />

          <mc.BigImageHeaderContainer>
            <mc.BigImageGradient colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']} />
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
          </mc.BigImageHeaderContainer>

          <mc.VenueDetails
            data={data}
            location={location}
            onMapsClick={this.onMapsClick}
          />

          {data != null && (
            <mc.Reviews data={data.reviews} />
          )}
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

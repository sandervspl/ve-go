import React from 'react';
import PT from 'prop-types';
import { ActivityIndicator, Linking } from 'react-native';
import call from 'react-native-phone-call';
import * as c from '../../common';
import * as mc from './components';
import { apiConfig, getDistanceFromLatLonInM } from '../../../helpers';
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

  render() {
    const { loading, photoLoading, data, photoUrl } = this.state;
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

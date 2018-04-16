import React from 'react';
import PT from 'prop-types';
import { ActivityIndicator, Linking, Text } from 'react-native';
import { withNavigationFocus } from 'react-navigation-is-focused-hoc';
import { connect } from 'react-redux';
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
    isSaved: null,
    error: null,
  };

  componentDidMount() {
    this.getRestaurantData();
  }

  componentDidUpdate(prevProps) {
    const { loading, data } = this.state;

    if (!loading && data == null && !prevProps.app.online && this.props.app.online) {
      this.getRestaurantData();
    }
  }

  onMapsClick = () => {
    Linking.openURL(this.state.data.url)
      .catch(e => console.log(e));
  };

  setSaveState = (isSaved) => {
    this.setState({ isSaved });
  };

  getRestaurantData = async () => {
    if (!this.props.app.online) {
      this.setState({
        loading: false,
        error: {
          type: 'data',
          emoji: '☹️',
          text: 'Cannot get restaurant data while offline.',
        },
      });

      return;
    }

    try {
      const { preFetchData } = this.props.navigation.state.params;

      this.setState({
        loading: true,
        error: null,
      });

      // fetch venue information
      const venueResponse = await fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.place_id}`);
      const venueData = await venueResponse.json();
      let isSaved = false;

      // check if venue is is saved as favorite
      if (await asyncStorage.isSaved(venueData.place_id)) {
        isSaved = true;
      }

      // store venuedata in state
      this.setState({
        loading: false,
        data: venueData,
        isSaved,
      });

      // fetch venue photos with reference
      if (venueData.photos && venueData.photos[0]) {
        try {
          this.setState({ photoLoading: true });

          const photoRef = venueData.photos[0].photo_reference;
          const photosResponse = await fetch(`${apiConfig.url}/vegan/restaurant/photo/${photoRef}`);
          const photoData = await photosResponse.json();

          this.setState({
            photoUrl: photoData.url,
            photoLoading: false,
          });
        } catch (e) {
          console.log(e);

          this.setState({
            loading: false,
            photoLoading: false,
            error: {
              type: 'photo',
              emoji: '📷',
              text: 'Error while retrieving photo.',
            },
          });
        }
      }
    } catch (e) {
      console.log(e);

      this.setState({
        loading: false,
        error: {
          type: 'data',
          emoji: '☹️',
          text: 'Error while retrieving restaurant data.',
        },
      });
    }
  };

  render() {
    const { loading, photoLoading, data, photoUrl, isSaved, error } = this.state;
    const { preFetchData, location } = this.props.navigation.state.params;
    const photoSrc = photoUrl != null ? { uri: photoUrl } : DefaultImage;

    return (
      <c.MainView height="100%">
        <c.ScrollContainer fullHeight={loading}>
          <mc.RatingCircleContainer
            data={data}
            loading={loading}
            preData={preFetchData}
            isSaved={isSaved}
            setSaveState={this.setSaveState}
            stop={!this.props.isFocused}
          />

          {error && error.type === 'data' && (
            <c.CenterView>
              <c.Error>
                <c.Emoji>{error.emoji}</c.Emoji>
                <Text>{error.text}</Text>
              </c.Error>
              <c.Button onPress={this.getRestaurantData}>Retry</c.Button>
            </c.CenterView>
          )}

          <mc.BigImageHeaderContainer>
            <mc.BigImageGradient colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']} />
            <mc.InnerImageContainer>
              {error && error.type === 'photo' && (
                <c.CenterView>
                  <c.Emoji>{error.emoji}</c.Emoji>
                  <Text>{error.text}</Text>
                </c.CenterView>
              )}

              {error == null && !loading && !photoLoading && (
                <mc.BigImage source={photoSrc} style={{ width: '100%', height: '100%' }} />
              )}

              {loading || photoLoading && (
                <c.CenterView>
                  <ActivityIndicator />
                </c.CenterView>
              )}
            </mc.InnerImageContainer>
          </mc.BigImageHeaderContainer>

          {data != null && data.url && (
            <mc.VenueDetails data={data} location={location} onMapsClick={this.onMapsClick} />
          )}

          {data != null && <mc.Reviews data={data.reviews} />}
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
  app: PT.shape({
    online: PT.bool,
  }),
};

const mapStateToProps = state => ({
  app: state.app,
});

export default connect(mapStateToProps)(withNavigationFocus(RestaurantDetail));

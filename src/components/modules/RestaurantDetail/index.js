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
    hours: null,
    menu: null,
  };

  componentDidMount() {
    const { preFetchData } = this.props.navigation.state.params;

    this.setState({ loading: true });

    // fetch venue information
    fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.id}`)
      .then(response => response.json())
      .then((data) => {
        // console.log(data);
        this.setState({
          loading: false,
          data: data.response.venue ? data.response.venue : data.meta,
        });
      })
      .catch(e => console.error(e));

    fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.id}/hours`)
      .then(response => response.json())
      .then((data) => {
        this.setState({ hours: data.response ? data.response : data.meta });
      })
      .catch(e => console.error(e));

    fetch(`${apiConfig.url}/vegan/restaurant/${preFetchData.id}/menu`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ menu: data.response.menu ? data.response.menu : data.meta });
      })
      .catch(e => console.error(e));
  }

  formatPhotoURL = item => (
    `${item.prefix}${item.width}x${item.height}${item.suffix}`
  );

  render() {
    const { loading, data, menu, hours } = this.state;
    const { preFetchData } = this.props.navigation.state.params;
    const photos = data != null ? data.photos.groups.find(g => g.type === 'venue') || data.photos.groups[0] : null;
    const photoSrc = photos != null
      ? { uri: this.formatPhotoURL(photos.items[0]) }
      : DefaultImage;

    return (
      <c.MainView height="100%">
        <c.ScrollContainer>
          <mc.BigImageHeaderContainer>
            <mc.InnerImageContainer>
              {!loading ? (
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
                    {data.rating ? data.rating : 'No rating'}
                  </mc.CollageText>
                </mc.CollageBlock>
                <mc.CollageBlock bottom>
                  <mc.CollageText>
                    {hours && hours.hours && hours.hours.timeframes ? 'TODO' : 'No times available'}
                  </mc.CollageText>
                </mc.CollageBlock>
                <mc.CollageBlock right>
                  <mc.CollageText>
                    {data.price && data.price.message ? data.price.message : 'No price info'}
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
            ) : !data.code && (
              <View>
                <Text>
                  {data.location.formattedAddress}
                </Text>
                {data.contact.formattedPhone && <Text>{data.contact.formattedPhone}</Text>}
                {data.url && <Text>{data.url}</Text>}
                <Text>
                  {data.categories.reduce((list, category, i) => {
                    if (i === 0) return category.shortName;
                    return `${list}, ${category.shortName}`;
                  }, '')}
                </Text>
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

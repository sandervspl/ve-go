import PT from 'prop-types';

const locationShape = PT.shape({
  lat: PT.number,
  lng: PT.number,
});

export const venuesResultProps = PT.arrayOf(PT.shape({
  geometry: PT.shape({
    location: locationShape,
    viewport: PT.shape({
      northeast: locationShape,
      southwest: locationShape,
    }),
  }),
  icon: PT.string,
  id: PT.string,
  name: PT.string,
  opening_hours: PT.shape({
    open_now: PT.bool,
    weekday_text: PT.arrayOf(PT.any),
  }),
  photos: PT.arrayOf(PT.shape({
    height: PT.number,
    html_attributions: PT.arrayOf(PT.string),
    photo_reference: PT.string,
    width: PT.number,
  })),
  place_id: PT.string,
  rating: PT.number,
  reference: PT.string,
  scope: PT.string,
  types: PT.arrayOf(PT.string),
  vicinity: PT.string,
}));

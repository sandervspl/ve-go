import theme from '../style/theme';


export const ratingColor = (rating) => {
  if (rating == null) {
    return theme.color.lightgray;
  }

  if (rating <= 2) {
    return theme.color.lightRed;
  }

  if (rating < 4) {
    return theme.color.lightOrange;
  }

  return theme.color.lightGreen;
};

import { color } from '../components/common/styles';


export const ratingColor = (rating) => {
  if (rating == null) {
    return color.lightgray;
  }

  if (rating <= 2) {
    return color.red;
  }

  if (rating < 4) {
    return color.orange;
  }

  return color.green;
};

import { createAction } from '../../helpers';

// action constants
export const SET_ONLINE_STATE = 'app/SET_ONLINE_STATE';

// state
export const initialState = {
  online: true,
};

// reducer
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ONLINE_STATE:
      return {
        ...state,
        online: action.payload,
      };

    default:
      return state;
  }
};

// actions
export const setOnlineState = createAction(SET_ONLINE_STATE);

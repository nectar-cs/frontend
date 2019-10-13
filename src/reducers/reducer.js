import { actionKeys } from '../actions/action'

const initialState = {
  workspaces: []
};

export default function mainReducer(state = initialState, action) {
  switch (action.type) {
    case actionKeys.SetWorkspaces:
      const { workspaces } = action;
      return({...state, workspaces});
    default:
      return state;
  }
}
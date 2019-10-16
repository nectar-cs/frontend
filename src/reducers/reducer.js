import { actionKeys } from '../actions/action'

const initialState = {
  workspaces: []
};

export default function mainReducer(s = initialState, action) {
  switch (action.type) {
    case actionKeys.SetWorkspaces:
      const { workspaces } = action; //TODO wtf about action.type
      return({...s, workspaces});
    default:
      return s;
  }
}
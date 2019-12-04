import { actionKeys } from '../actions/action';

const initialState = {
  workspaces: [],
  remotes: { git: [], docker: [] },
};

function partitionRemotes(remotes) {
  return remotes.reduce((acc, remote) => {
    const bucket = acc[remote.entity];
    return { ...acc, [remote.entity]: [...bucket, remote] };
  }, initialState.remotes);
}

export default function mainReducer(s = initialState, action) {
  switch (action.type) {
    case actionKeys.SetRemotes:
      const { remotes } = action;
      return { ...s, remotes: partitionRemotes(remotes) };
    case actionKeys.SimpleSet:
      return { ...s, ...action.data };
    default:
      return s;
  }
}

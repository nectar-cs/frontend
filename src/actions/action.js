const actionKeys = {
  SetRemotes: "SET_REMOTES",
  SimpleSet: "SIMPLE_SET"
};

export { actionKeys };

export function setWorkspaces(workspaces){
  return {
    type: actionKeys.SimpleSet,
    data: { workspaces }
  }
}

export function setModalOps(openModal, replaceModal){
  return {
    type: actionKeys.SimpleSet,
    data: {
      openModal,
      replaceModal
    }
  }
}

export function setRemotes(remotes){
  return { type: actionKeys.SetRemotes, remotes }
}

export function setPath(crtAppPath){
  return { type: actionKeys.SimpleSet, data: { crtAppPath  } };
}
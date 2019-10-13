import Backend from "../utils/Backend";

const actionKeys = {
  SetWorkspaces: "SET_WORKSPACES"
};

export { actionKeys };

export function setWorkspaces(workspaces){
  return { type: actionKeys.SetWorkspaces, workspaces }
}
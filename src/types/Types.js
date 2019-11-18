//@flow

export type RemoteBundle = {
  identifier: string,
  type: string,
  contents: Array<RemoteRepo>
}

export type RemoteRepo = {
  id: number,
  name: string,
  framework: ?string,
};

export type Matching = {
  id: number,
  deploymentName: string,
  framework: ?string,
  gitRemoteName: ?string,
  imgRemoteName: ?string,
  gitRepoName: ?string,
  imgRepoName: ?string,
  gitRemoteId: ?number,
  imgRemoteId: ?number,
  dockerfilePath: ?string
};

export type Deployment = {
  name: string,
  namespace: string,
  replicas: number,
  imageName: string,
  containerName: string,
  labels: {  [string]: string }
  imagePullPolicy: ('Always' | 'Never')
};

export type WideDeployment = {
  name: string,
  namespaces: Array<String>
}

export type LightUser = {
  id: number,
  wasOnboarded: boolean
}

export type Workspace = {
  id: ?number,
  name: string,
  isDefault: boolean,
  nsFilters: string[],
  lbFilters: string[],
  nsFilterType: 'whitelist' | 'blacklist',
  lbFilterType: 'whitelist' | 'blacklist'
}

export type RevisionStatus = {
  appName: string,
  updateNecessary: boolean,
  currentRevision: ?string,
  latestRevision: ?string
}

export type LabelMatrix = {
  colNames: string[],
  rowNames: Array<string>,
  rowValues: Array<string[]>,
}
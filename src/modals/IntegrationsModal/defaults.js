const defaults = {
  intro: "Mosaic is a lot more useful when it talks to your image and source repos.",
  dockerApology: "Password auth, I know... Unfortunately that's how DockerHub rolls ;( ",
  vendorQuestion: "What image registry do you want to add?",
  addNewImageReg: "Add an image registry",
  addNewGitRemote: "Add a Git Remote",

  imageRegistryVendors: [
    { name: 'dockerhub', image: ['docker'] },
    { name: 'aws', image: ['amazonwebservices', 'original.svg'] },
    { name: 'azure', image: ['azure', 'plain.png'] }
  ],

  gitRemoteVendors: [
    { name: 'github', image: ['github'] },
    { name: 'bitbucket', image: ['bitbucket'] }
  ]
};

export default defaults;
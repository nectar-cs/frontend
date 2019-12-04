const defaults = {
  intro: 'Mosaic is a lot more useful when it talks to your image' + ' and source repos.',
  dockerApology: "Password auth, I know... Unfortunately that's how" + ' DockerHub rolls ;( ',
  imgVendorQuestion: 'What image registry do you want to add?',
  gitVendorQuestion: 'What git remote do you want to add?',
  addNewImageReg: 'Add an image registry',
  addNewGitRemote: 'Add a Git Remote',

  imageRegistryVendors: [
    { name: 'dockerhub', image: ['docker'] },
    { name: 'aws', image: ['amazonwebservices', 'original.svg'] },
    { name: 'azure', image: ['azure', 'plain.png'] },
  ],

  gitRemoteVendors: [
    { name: 'github', image: ['github', 'original.svg'] },
    { name: 'bitbucket', image: ['bitbucket', 'original.svg'] },
    { name: 'gitlab', image: ['gitlab', 'plain.svg'] },
  ],

  gitFwdNotice:
    'Clicking "Connect" will take you to GitHub\'s' + ' third party authorization page.',

  confirmDelete: 'Are you sure you want to delete this integration?',
};

export default defaults;

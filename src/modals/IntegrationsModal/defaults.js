const defaults = {
  dockerApology: "Password auth... Unfortunately that's how DockerHub rolls :( ",

  vendors: [
    { mame: 'dockerhub', image: ['docker'] },
    { name: 'aws', image: ['amazonwebservices', 'original.svg'] },
    { name: 'azure', image: ['azure', 'plain.png'] }
  ]
};

export default defaults;
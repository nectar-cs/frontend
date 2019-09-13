const defaults = {
  intro: "Mosaic is a lot more useful when it talks to your image and source repos.",
  dockerApology: "Password auth, I know... Unfortunately that's how DockerHub rolls ;( ",

  vendors: [
    { name: 'dockerhub', image: ['docker'] },
    { name: 'aws', image: ['amazonwebservices', 'original.svg'] },
    { name: 'azure', image: ['azure', 'plain.png'] }
  ]
};

export default defaults;
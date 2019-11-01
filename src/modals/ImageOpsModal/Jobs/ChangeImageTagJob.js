import PodJob from "./PodJob";

export default class ChangeImageTagJob extends PodJob{
  prepare({imageName}){
    this.imageName = imageName;
  }
}
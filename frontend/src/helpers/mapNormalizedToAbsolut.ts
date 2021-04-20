export default function (pose, width, height) {

  for (let i = 0; i < pose.length; i+=2) {
     pose[i]=pose[i]*width
     pose[i+1]=pose[i+1]*height
  }
  return pose;
}
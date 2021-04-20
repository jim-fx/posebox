export default function (pose, width, height) {

  let temp = [];
  for (let i = 0; i < pose.length; i+=2) {
     temp[i]=pose[i]*width
     temp[i+1]=pose[i+1]*height
  }
  return temp;
}
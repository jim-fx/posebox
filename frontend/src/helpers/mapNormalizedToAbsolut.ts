export default function (pose,width,height){

    return pose.map(point =>{
        return {
            part: point.part,
            x: point.x * width,
            y:point.y * height
        }
    })
}
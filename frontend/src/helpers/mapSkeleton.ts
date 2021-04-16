export default function (pose) {
    const output: { [key: string]: { x: number, y: number } } = {}

    pose.forEach(point => [
        output[point.part] = {
            x: point.x,
            y: point.y
        }
    ]);

    return output;
}
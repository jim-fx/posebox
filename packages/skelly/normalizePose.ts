export default function normalizePose(pose) {
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    pose.forEach((point, i) => {
        if (i % 2 == 0) {
            minX = Math.min(minX, point)
            maxX = Math.max(maxX, point)
        } else {
            minY = Math.min(minY, point)
            maxY = Math.max(maxY, point)
        }
    });

    return pose.map((point, i) => {
        if (i % 2 == 0) {
            return map(point, minX, maxX)
        } else {
            return map(point, minY, maxY)
        }
    });

}

function map(v, min, max) {
    return (v - min) / (max - min)
}
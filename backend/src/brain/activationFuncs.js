function sigmoid(weight) {
  return 1 / 1 + Math.pow(Math.E, -weight);
}

function relu(weight) {
  return Math.max(0, weight);
}

module.exports = {
  sigmoid,
  relu,
};

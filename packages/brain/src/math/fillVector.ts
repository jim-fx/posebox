export default (vec, cb) => vec.map(() => (cb ? cb() : 0));

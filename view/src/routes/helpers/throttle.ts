export default (fn: (...args: any[]) => any, wait: number) => {
  let shouldWait = false;

  return function (...args: any[]) {
    if (!shouldWait) {
      fn(...args);
      shouldWait = true;
      setTimeout(() => (shouldWait = false), wait);
    }
  };
};

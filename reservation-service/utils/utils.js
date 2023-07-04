const counter = (() => {
  const getNanoSeconds = () => {
    const currentTime = process.hrtime();
    return (currentTime[0] * 1e9) + currentTime[1];
  };
  const loadTime = getNanoSeconds();
  return (startTime) => {
    const now = (getNanoSeconds() - loadTime) / 1e6;
    return startTime ? now - startTime : now;
  };
})();

module.exports = {
  counter
};

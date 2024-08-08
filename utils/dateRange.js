module.exports = function getDateRange(greaterThan, lessThan) {
  if (!greaterThan || !lessThan) {
    return null;
  }
  return {
    greaterThan: greaterThan,
    lessThan: lessThan
  };
};

module.exports = {
  name: '$all',

  type: 'application/json',

  response(json, analysis) {
    analysis.set('message', 'For no reason, that is it!');
  },
};

module.exports = {
  name: 'CreateAccount',

  type: 'application/json',

  request(json, analysis) {
    if (!json('request.name')) {
      analysis.push('error', 'The user should have a name!');
    }
  },

  response(json, analysis) {
    if (json('response.status') === '1') {
      analysis.push('error', 'That is a validation error, look at our request.');
    }
  },
};

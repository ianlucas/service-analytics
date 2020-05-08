function handleAnalysis() {
  const data = {};

  return {
    push(key, value) {
      const lastValue = data[key];
      if (Array.isArray(lastValue)) {
        lastValue.push(value);
      } else {
        data[key] = [];
        if (lastValue !== undefined) {
          data[key].push(lastValue);
        }
        data[key].push(value);
      }
    },

    set(key, value) {
      data[key] = value;
    },

    get() {
      return data;
    },
  };
}

export default handleAnalysis;

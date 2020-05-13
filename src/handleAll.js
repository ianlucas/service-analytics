function handleDefaults(services, type) {
  const all = services.find((other) => (
    other.name === '$all'
      && other.type === type
  )) || {};

  if (!all.request) {
    all.request = () => 0;
  }

  if (!all.response) {
    all.response = () => 0;
  }

  return all;
}

module.exports = handleDefaults;

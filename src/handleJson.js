function handleJson(text) {
  let json = text;

  try {
    json = JSON.parse(text);
  } catch (e) {
    json = {};
  }

  return function get(path) {
    let current = json;
    try {
      path
        .split('.')
        .forEach((prop) => {
          current = current[prop];
        });
    } catch (e) {
      return null;
    }
    return current;
  };
}

export default handleJson;

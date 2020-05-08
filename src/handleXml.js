import Sizzle from 'src/Sizzle';

function handleXml(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');

  function mutate(node) {
    Object.assign(node, {
      is() {
        return node.textContent.trim();
      },
    });
    return node;
  }

  return {
    one(selector) {
      return Sizzle(selector, doc).map(mutate)[0] || ({
        is: (() => ''),
      });
    },

    all(selector) {
      return Sizzle(selector, doc).map(mutate);
    },
  };
}

export default handleXml;

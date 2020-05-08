import handleXml from 'src/handleXml';
import handleJson from 'src/handleJson';
import handleAnalysis from 'src/handleAnalysis';

class ServiceAnalysis {
  constructor() {
    this.services = [/* imports */];
  }

  analyse(name, requestText, responseText) {
    const service = this.services.find((other) => (
      other.name === name
    ));

    if (!service) {
      throw new Error(`[service-analytics] Service "${name}" was not found.`);
    }

    if (!service.type) {
      throw new Error(`[service-analytics] No type found for service "${name}".`);
    }

    let handle;
    const analysis = handleAnalysis();

    if (service.type === 'application/json') {
      handle = handleJson;
    } else if (service.type === 'text/xml') {
      handle = handleXml;
    }

    if (service.request) {
      service.request(handle(requestText), analysis);
    }

    if (service.response) {
      service.response(handle(responseText), analysis);
    }

    return analysis.get();
  }
}

export default new ServiceAnalysis();

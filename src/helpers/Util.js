
export class Util {
  static toInt(obj) {
    return Number.parseInt(obj, 10);
  }

  static increment(obj) {
    return Util.toInt(obj) + 1;
  }

  static getFileType(fileType) {
    const pdfType = 'pdf';
    const imageType = 'image';
    const videoType = 'video';
    if (fileType.indexOf(pdfType) !== -1) {
      return pdfType;
    }
    if (fileType.indexOf(imageType) !== -1) {
      return imageType;
    }
    if (fileType.indexOf(videoType) !== -1) {
      return videoType;
    }
    return 'not_supported';
  }

  static formatConcepts(concepts) {
    const formattedConcepts = concepts.map(concept => ({
      uuid: `${concept.conceptSystem}/${concept.conceptUuid}`,
      name: concept.conceptName,
      displayString: concept.conceptName,
      codedAnswer: {
        uuid: `${concept.conceptSystem}/${concept.conceptUuid}`,
      },
    }));
    return formattedConcepts;
  }

  static uploadFile(file, patientUuid, fileType) {
    const searchStr = ';base64';
    const format = file.split(searchStr)[0].split('/')[1];
    const url = '/openmrs/ws/rest/v1/bahmnicore/visitDocument/uploadDocument';
    return fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: file.substring(file.indexOf(searchStr) + searchStr.length, file.length),
        format,
        patientUuid,
        fileType: fileType || 'file',
      }),
      credentials: 'include',
    });
  }

  static isComplexMediaConcept(concept) {
    const { datatype, conceptHandler } = concept;
    return (datatype === 'Complex') &&
      (conceptHandler === 'ImageUrlHandler' || conceptHandler === 'VideoUrlHandler');
  }

  static getConfig() {
    return fetch('/bahmni_config/openmrs/apps/clinical/app.json', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });
  }

  static getAnswers(url, term = '', limit = 30) {
    const endpoint =
      '/openmrs/ws/rest/v1/terminologyServices/getObservationValueSet?valueSetUrl';
    const fullUrl = `${endpoint}=${url}&term=${term}&limit=${limit}`;
    return fetch(fullUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });
  }

  static debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
}

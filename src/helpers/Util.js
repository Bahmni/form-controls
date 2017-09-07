
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
}

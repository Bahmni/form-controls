import { Util } from 'src/helpers/Util';
import fetchMock from 'fetch-mock';

describe('Util', () => {
  it('should convert string to number', () => {
    const stringNum = '100';

    const num = Util.toInt(stringNum);

    expect(num).toBe(100);
  });

  it('should increment one when Util.increment be called', () => {
    const originNum = 100;

    const targetNum = Util.increment(originNum);

    expect(targetNum).toBe(originNum + 1);
  });

  it('should format the concepts accordingly', () => {
    const concepts = [
      {
        conceptSystem: 'system1',
        conceptUuid: 'uuid1',
        conceptName: 'name1',
      },
      {
        conceptSystem: 'system2',
        conceptUuid: 'uuid2',
        conceptName: 'name2',
      },
    ];
    const expectedFormattedConcepts = [
      {
        uuid: 'system1/uuid1',
        name: 'name1',
        displayString: 'name1',
        codedAnswer: {
          uuid: 'system1/uuid1',
        },
        system: 'system1',
        code: 'uuid1',
      },
      {
        uuid: 'system2/uuid2',
        name: 'name2',
        displayString: 'name2',
        codedAnswer: {
          uuid: 'system2/uuid2',
        },
        system: 'system2',
        code: 'uuid2',
      },
    ];

    const formattedConcepts = Util.formatConcepts(concepts);
    expect(formattedConcepts).toEqual(expectedFormattedConcepts);
  });

  describe('getFileType', () => {
    it('should return "pdf" for PDF file types', () => {
      expect(Util.getFileType('application/pdf')).toBe('pdf');
      expect(Util.getFileType('some/pdf/type')).toBe('pdf');
    });

    it('should return "image" for image file types', () => {
      expect(Util.getFileType('image/jpeg')).toBe('image');
      expect(Util.getFileType('image/png')).toBe('image');
      expect(Util.getFileType('some/image/type')).toBe('image');
    });

    it('should return "video" for video file types', () => {
      expect(Util.getFileType('video/mp4')).toBe('video');
      expect(Util.getFileType('video/avi')).toBe('video');
      expect(Util.getFileType('some/video/type')).toBe('video');
    });

    it('should return "not_supported" for unsupported file types', () => {
      expect(Util.getFileType('text/plain')).toBe('not_supported');
      expect(Util.getFileType('application/json')).toBe('not_supported');
      expect(Util.getFileType('audio/mp3')).toBe('not_supported');
    });
  });

  describe('uploadFile', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should make POST request to upload endpoint', async () => {
      const base64File = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
      const patientUuid = 'patient-123';
      const fileType = 'image';

      fetchMock.mock(
        '/openmrs/ws/rest/v1/bahmnicore/visitDocument/uploadDocument',
        200,
      );

      const response = await Util.uploadFile(base64File, patientUuid, fileType);

      expect(fetchMock.calls().matched).toHaveLength(1);
      expect(fetchMock.calls().matched[0][0]).toBe(
        '/openmrs/ws/rest/v1/bahmnicore/visitDocument/uploadDocument',
      );
      expect(response).toBeDefined();
    });

    it('should make request when fileType not provided', async () => {
      const base64File = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
      fetchMock.mock('*', 200);

      await Util.uploadFile(base64File, 'patient-123');

      expect(fetchMock.calls().matched).toHaveLength(1);
    });
  });

  describe('isComplexMediaConcept', () => {
    it('should return true for Complex datatype with ImageUrlHandler', () => {
      const concept = {
        datatype: 'Complex',
        conceptHandler: 'ImageUrlHandler',
      };
      expect(Util.isComplexMediaConcept(concept)).toBe(true);
    });

    it('should return true for Complex datatype with VideoUrlHandler', () => {
      const concept = {
        datatype: 'Complex',
        conceptHandler: 'VideoUrlHandler',
      };
      expect(Util.isComplexMediaConcept(concept)).toBe(true);
    });

    it('should return false for non-Complex datatype', () => {
      const concept = {
        datatype: 'Text',
        conceptHandler: 'ImageUrlHandler',
      };
      expect(Util.isComplexMediaConcept(concept)).toBe(false);
    });

    it('should return false for Complex datatype with other handlers', () => {
      const concept = {
        datatype: 'Complex',
        conceptHandler: 'SomeOtherHandler',
      };
      expect(Util.isComplexMediaConcept(concept)).toBe(false);
    });

    it('should return false for missing properties', () => {
      expect(Util.isComplexMediaConcept({})).toBe(false);
      expect(Util.isComplexMediaConcept({ datatype: 'Complex' })).toBe(false);
      expect(
        Util.isComplexMediaConcept({ conceptHandler: 'ImageUrlHandler' }),
      ).toBe(false);
    });
  });

  describe('getConfig', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should return response when Util.getConfig status is 200', async () => {
      fetchMock.mock('*', {
        config: {
          terminologyService: {
            limit: 20,
            system: 'SOME_SYSTEM',
          },
        },
      });

      const res = await Util.getConfig('/someUrl');
      expect(fetchMock.calls().matched).toHaveLength(1);
      expect(res.config.terminologyService.system).toBe('SOME_SYSTEM');
    });

    it('should throw an error when Util.getConfig status is not 2xx', async () => {
      fetchMock.mock('*', 404);

      await expect(Util.getConfig('/someUrl')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('getAnswers', () => {
    afterEach(() => {
      fetchMock.restore();
      fetchMock.reset();
    });

    it('should return response when Util.getAnswers status is 200', async () => {
      fetchMock.mock('*', [
        {
          conceptName: 'someName',
          conceptUuid: 'someUuid',
          matchedName: 'someName',
          conceptSystem: 'someSystem',
        },
      ]);

      const res = await Util.getAnswers('/someUrl');
      expect(fetchMock.calls().matched).toHaveLength(1);
      expect(res[0].conceptName).toBe('someName');
    });

    it('should throw an error when Util.getAnswers status is not 2xx', async () => {
      fetchMock.mock('*', 404);

      await expect(Util.getAnswers('/someUrl')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(global, 'setTimeout');
      jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay the function execution', () => {
      const func = jest.fn();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(delay);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should debounce multiple function calls', () => {
      const func = jest.fn();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(delay);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should execute the function with the latest arguments', () => {
      const func = jest.fn();
      const delay = 500;
      const debouncedFunc = Util.debounce(func, delay);

      debouncedFunc(1);
      debouncedFunc(2);
      debouncedFunc(3);

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(delay);

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenLastCalledWith(3);
    });
  });
});

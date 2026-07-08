import { getFhirObservations, getObservationsFromFhir } from 'src/helpers/FhirObservationTransformer';
import {
  FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
  FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
  FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
  FHIR_OBSERVATION_STATUS_FINAL,
  FHIR_RESOURCE_TYPE_OBSERVATION,
  CODE_TO_INTERPRETATION,
  INTERPRETATION_TO_CODE,
} from 'src/constants/fhir';

describe('FhirObservationTransformer', () => {
  const defaultOptions = {
    patientReference: { reference: 'Patient/patient-uuid' },
    encounterReference: { reference: 'Encounter/encounter-uuid' },
    performerReference: { reference: 'Practitioner/practitioner-uuid' },
  };

  describe('getFhirObservations', () => {
    it('should return empty array for null observations', () => {
      const result = getFhirObservations(null, defaultOptions);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined observations', () => {
      const result = getFhirObservations(undefined, defaultOptions);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array observations', () => {
      const result = getFhirObservations('invalid', defaultOptions);
      expect(result).toEqual([]);
    });

    it('should transform a basic observation with string value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid', datatype: 'Text' },
          value: 'test value',
          formNamespace: 'Bahmni',
          formFieldPath: 'TestForm.1/1-0',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.resourceType).toBe(FHIR_RESOURCE_TYPE_OBSERVATION);
      expect(result[0].resource.status).toBe(FHIR_OBSERVATION_STATUS_FINAL);
      expect(result[0].resource.valueString).toBe('test value');
      expect(result[0].resource.code.coding[0].code).toBe('concept-uuid');
      expect(result[0].resource.subject).toEqual(defaultOptions.patientReference);
      expect(result[0].resource.encounter).toEqual(defaultOptions.encounterReference);
      expect(result[0].resource.performer).toEqual([defaultOptions.performerReference]);
      expect(result[0].fullUrl).toMatch(/^urn:uuid:/);
      expect(result[0].resource.id).toBeDefined();
    });

    it('should transform observation with numeric value', () => {
      const observations = [
        {
          concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
          value: 72,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueQuantity).toEqual({ value: 72 });
    });

    it('should transform observation with boolean value', () => {
      const observations = [
        {
          concept: { uuid: 'smoking-uuid', datatype: 'Boolean' },
          value: true,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueBoolean).toBe(true);
    });

    it('should transform observation with date string value', () => {
      const observations = [
        {
          concept: { uuid: 'dob-uuid', datatype: 'Date' },
          value: '2024-01-15',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueDateTime).toBeDefined();
      expect(result[0].resource.valueDateTime).toMatch(/^2024-01-15/);
    });

    it('should transform observation with Date object value', () => {
      const dateValue = new Date('2024-01-15T10:30:00Z');
      const observations = [
        {
          concept: { uuid: 'datetime-uuid', datatype: 'DateTime' },
          value: dateValue,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueDateTime).toBe(dateValue.toISOString());
    });

    it('should transform observation with coded value (uuid object)', () => {
      const observations = [
        {
          concept: { uuid: 'gender-uuid', datatype: 'Coded' },
          value: { uuid: 'male-uuid', display: 'Male' },
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueCodeableConcept).toBeDefined();
      expect(result[0].resource.valueCodeableConcept.coding[0].code).toBe('male-uuid');
      expect(result[0].resource.valueCodeableConcept.coding[0].display).toBe('Male');
    });

    it('should transform observation with coded value using displayString', () => {
      const observations = [
        {
          concept: { uuid: 'gender-uuid', datatype: 'Coded' },
          value: { uuid: 'female-uuid', displayString: 'Female' },
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueCodeableConcept.coding[0].display).toBe('Female');
    });

    it('should handle numeric string for Numeric datatype', () => {
      const observations = [
        {
          concept: { uuid: 'weight-uuid', datatype: 'Numeric' },
          value: '75.5',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueQuantity).toEqual({ value: 75.5 });
    });

    it('should skip voided observations', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          voided: true,
        },
        {
          concept: { uuid: 'concept-uuid-2' },
          value: 'test2',
          voided: false,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.code.coding[0].code).toBe('concept-uuid-2');
    });

    it('should include interpretation when provided', () => {
      const observations = [
        {
          concept: { uuid: 'bp-uuid' },
          value: 140,
          interpretation: 'ABNORMAL',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.interpretation).toBeDefined();
      expect(result[0].resource.interpretation[0].coding[0].system).toBe(
        FHIR_OBSERVATION_INTERPRETATION_SYSTEM
      );
      expect(result[0].resource.interpretation[0].coding[0].code).toBe('A');
      expect(result[0].resource.interpretation[0].coding[0].display).toBe('Abnormal');
    });

    it('should handle lowercase interpretation', () => {
      const observations = [
        {
          concept: { uuid: 'bp-uuid' },
          value: 120,
          interpretation: 'normal',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.interpretation[0].coding[0].code).toBe('N');
      expect(result[0].resource.interpretation[0].coding[0].display).toBe('Normal');
    });

    it('should include form namespace and field path extension', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          formNamespace: 'Bahmni',
          formFieldPath: 'TestForm.1/1-0',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.extension).toBeDefined();
      const formPathExtension = result[0].resource.extension.find(
        (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
      );
      expect(formPathExtension).toBeDefined();
      expect(formPathExtension.valueString).toBe('Bahmni^TestForm.1/1-0');
    });

    it('should not include form path extension when namespace or path is missing', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          formNamespace: 'Bahmni',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      const formPathExtension = result[0].resource.extension?.find(
        (ext) => ext.url === FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL
      );
      expect(formPathExtension).toBeUndefined();
    });

    it('should include comment as note', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          comment: 'This is a clinical note',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.note).toBeDefined();
      expect(result[0].resource.note[0].text).toBe('This is a clinical note');
    });

    it('should handle complex datatype with attachment extension', () => {
      const observations = [
        {
          concept: { uuid: 'image-uuid', datatype: 'Complex' },
          value: 'http://example.com/image.jpg',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.extension).toBeDefined();
      const complexExtension = result[0].resource.extension.find(
        (ext) => ext.url === FHIR_OBSERVATION_VALUE_ATTACHMENT_URL
      );
      expect(complexExtension).toBeDefined();
      expect(complexExtension.valueAttachment.url).toBe('http://example.com/image.jpg');
      expect(result[0].resource.valueString).toBe('http://example.com/image.jpg');
    });

    it('should use provided obsDatetime', () => {
      const obsDatetime = '2024-01-15T10:30:00.000Z';
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          obsDatetime,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.effectiveDateTime).toBe(obsDatetime);
    });

    it('should use provided observationDateTime (alternate field name)', () => {
      const observationDateTime = '2024-01-15T10:30:00.000Z';
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
          observationDateTime,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.effectiveDateTime).toBe(observationDateTime);
    });

    it('should handle concept as string uuid', () => {
      const observations = [
        {
          concept: 'direct-concept-uuid',
          value: 'test',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.code.coding[0].code).toBe('direct-concept-uuid');
    });

    it('should skip empty string values', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: '   ',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result[0].resource.valueString).toBeUndefined();
    });

    it('should handle basedOnReference when provided', () => {
      const basedOnReference = { reference: 'ServiceRequest/sr-uuid' };
      const optionsWithBasedOn = {
        ...defaultOptions,
        basedOnReference,
      };

      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: 'test',
        },
      ];

      const result = getFhirObservations(observations, optionsWithBasedOn);

      expect(result[0].resource.basedOn).toEqual([basedOnReference]);
    });
  });

  describe('group members handling', () => {
    it('should transform observation with group members', () => {
      const observations = [
        {
          concept: { uuid: 'vitals-group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
              value: 72,
            },
            {
              concept: { uuid: 'bp-uuid', datatype: 'Numeric' },
              value: 120,
            },
          ],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Should have 3 observations: 2 members + 1 parent
      expect(result).toHaveLength(3);

      // Find the parent observation (the one with hasMember)
      const parentObs = result.find((r) => r.resource.hasMember);
      expect(parentObs).toBeDefined();
      expect(parentObs.resource.hasMember).toHaveLength(2);

      // Verify hasMember references point to member observations
      const memberUrls = result
        .filter((r) => !r.resource.hasMember)
        .map((r) => r.fullUrl);
      parentObs.resource.hasMember.forEach((ref) => {
        expect(memberUrls).toContain(ref.reference);
      });
    });

    it('should handle nested group members', () => {
      const observations = [
        {
          concept: { uuid: 'outer-group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'inner-group-uuid' },
              groupMembers: [
                {
                  concept: { uuid: 'leaf-uuid' },
                  value: 'nested value',
                },
              ],
            },
          ],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Should have 3 observations: 1 leaf + 1 inner parent + 1 outer parent
      expect(result).toHaveLength(3);

      // Find inner parent (should have hasMember pointing to leaf)
      const innerParent = result.find(
        (r) => r.resource.code.coding[0].code === 'inner-group-uuid'
      );
      expect(innerParent.resource.hasMember).toHaveLength(1);

      // Find outer parent (should have hasMember pointing only to direct child: inner parent)
      const outerParent = result.find(
        (r) => r.resource.code.coding[0].code === 'outer-group-uuid'
      );
      expect(outerParent.resource.hasMember).toHaveLength(1);
      expect(outerParent.resource.hasMember[0].reference).toBe(
        innerParent.fullUrl
      );
    });

    it('should skip voided group members', () => {
      const observations = [
        {
          concept: { uuid: 'group-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'member1-uuid' },
              value: 'active',
              voided: false,
            },
            {
              concept: { uuid: 'member2-uuid' },
              value: 'voided',
              voided: true,
            },
          ],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Should have 2 observations: 1 active member + 1 parent
      expect(result).toHaveLength(2);

      const parentObs = result.find((r) => r.resource.hasMember);
      expect(parentObs.resource.hasMember).toHaveLength(1);
    });

    it('should handle 3-level deep nested group members', () => {
      const observations = [
        {
          concept: { uuid: 'outer-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'middle-uuid' },
              groupMembers: [
                {
                  concept: { uuid: 'inner-uuid' },
                  groupMembers: [
                    {
                      concept: { uuid: 'leaf-uuid' },
                      value: 'deep value',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Should have 4 observations: leaf + inner + middle + outer
      expect(result).toHaveLength(4);

      const outerObs = result.find((r) => r.resource.code.coding[0].code === 'outer-uuid');
      const middleObs = result.find((r) => r.resource.code.coding[0].code === 'middle-uuid');
      const innerObs = result.find((r) => r.resource.code.coding[0].code === 'inner-uuid');

      // Each parent references only its direct child
      expect(outerObs.resource.hasMember).toHaveLength(1);
      expect(outerObs.resource.hasMember[0].reference).toBe(middleObs.fullUrl);

      expect(middleObs.resource.hasMember).toHaveLength(1);
      expect(middleObs.resource.hasMember[0].reference).toBe(innerObs.fullUrl);

      expect(innerObs.resource.hasMember).toHaveLength(1);
    });

    it('should handle sibling groups and leaves under same parent', () => {
      const observations = [
        {
          concept: { uuid: 'parent-uuid' },
          groupMembers: [
            {
              concept: { uuid: 'inner-group-uuid' },
              groupMembers: [
                { concept: { uuid: 'leaf-in-group-uuid' }, value: 'value1' },
              ],
            },
            { concept: { uuid: 'leaf1-uuid' }, value: 'value2' },
            { concept: { uuid: 'leaf2-uuid' }, value: 'value3' },
          ],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // 1 leaf-in-group + 1 inner-group + 2 leaves + 1 parent = 5
      expect(result).toHaveLength(5);

      const parent = result.find((r) => r.resource.code.coding[0].code === 'parent-uuid');
      const innerGroup = result.find((r) => r.resource.code.coding[0].code === 'inner-group-uuid');

      // Parent references all 3 direct children (inner-group + leaf1 + leaf2)
      expect(parent.resource.hasMember).toHaveLength(3);
      expect(parent.resource.hasMember[0].reference).toBe(innerGroup.fullUrl);
    });

    it('should skip voided outer group entirely', () => {
      const observations = [
        {
          concept: { uuid: 'voided-group-uuid' },
          voided: true,
          groupMembers: [
            { concept: { uuid: 'child-uuid' }, value: 'active' },
          ],
        },
        {
          concept: { uuid: 'active-obs-uuid' },
          value: 'active',
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Only the active obs should be in results — voided group + its children skipped
      expect(result).toHaveLength(1);
      expect(result[0].resource.code.coding[0].code).toBe('active-obs-uuid');
    });
  });

  describe('multiple observations', () => {
    it('should transform multiple observations', () => {
      const observations = [
        {
          concept: { uuid: 'concept-1' },
          value: 'value1',
        },
        {
          concept: { uuid: 'concept-2' },
          value: 42,
        },
        {
          concept: { uuid: 'concept-3' },
          value: true,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(3);
      expect(result[0].resource.valueString).toBe('value1');
      expect(result[1].resource.valueQuantity).toEqual({ value: 42 });
      expect(result[2].resource.valueBoolean).toBe(true);
    });

    it('should generate unique UUIDs for each observation', () => {
      const observations = [
        { concept: { uuid: 'c1' }, value: 'v1' },
        { concept: { uuid: 'c2' }, value: 'v2' },
        { concept: { uuid: 'c3' }, value: 'v3' },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      const ids = result.map((r) => r.resource.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      const fullUrls = result.map((r) => r.fullUrl);
      const uniqueUrls = new Set(fullUrls);
      expect(uniqueUrls.size).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle observation with null value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: null,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueString).toBeUndefined();
      expect(result[0].resource.valueQuantity).toBeUndefined();
      expect(result[0].resource.valueBoolean).toBeUndefined();
    });

    it('should handle observation with undefined value', () => {
      const observations = [
        {
          concept: { uuid: 'concept-uuid' },
          value: undefined,
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      expect(result).toHaveLength(1);
      expect(result[0].resource.valueString).toBeUndefined();
    });

    it('should handle empty observations array', () => {
      const result = getFhirObservations([], defaultOptions);
      expect(result).toEqual([]);
    });

    it('should handle observation with empty groupMembers array', () => {
      const observations = [
        {
          concept: { uuid: 'group-uuid' },
          groupMembers: [],
        },
      ];

      const result = getFhirObservations(observations, defaultOptions);

      // Empty group members should still produce an observation without hasMember
      expect(result).toHaveLength(1);
      expect(result[0].resource.hasMember).toBeUndefined();
    });
  });
});

// ============================================================================
// Reverse Transformation: getObservationsFromFhir Tests
// ============================================================================

const makeEntry = (resource, id) => {
  const resourceId = id || resource.id || 'test-id';
  return {
    resource: { ...resource, id: resourceId },
    fullUrl: `urn:uuid:${resourceId}`,
  };
};

const makeConcept = (uuid, display) => ({
  coding: [{ code: uuid, display }],
  text: display,
});

const baseResource = (uuid, valueField) => ({
  resourceType: 'Observation',
  status: 'final',
  code: makeConcept(uuid, `Display for ${uuid}`),
  effectiveDateTime: '2024-06-01T10:00:00.000Z',
  ...valueField,
});

describe('getObservationsFromFhir', () => {
  describe('AC1 — Numeric observation', () => {
    it('should map valueQuantity.value to a numeric form2 value', () => {
      const resource = baseResource('pulse-uuid', { valueQuantity: { value: 72 } });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-1')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('pulse-uuid');
      expect(result[0].concept.datatype).toBe('Numeric');
      expect(result[0].value).toBe(72);
    });

    it('should preserve decimal numeric values', () => {
      const resource = baseResource('weight-uuid', { valueQuantity: { value: 75.5 } });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-2')]);

      expect(result[0].value).toBe(75.5);
    });
  });

  describe('AC2 — Text observation', () => {
    it('should map valueString to a text form2 value', () => {
      const resource = baseResource('cough-uuid', { valueString: 'cough' });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-3')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('cough-uuid');
      expect(result[0].concept.datatype).toBe('Text');
      expect(result[0].value).toBe('cough');
    });

    it('should preserve multi-word string values', () => {
      const resource = baseResource('notes-uuid', { valueString: 'Patient has severe headache' });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-4')]);

      expect(result[0].value).toBe('Patient has severe headache');
    });
  });

  describe('AC3 — Coded observation', () => {
    it('should map valueCodeableConcept to { uuid, display, name }', () => {
      const resource = baseResource('gender-uuid', {
        valueCodeableConcept: {
          coding: [{ code: 'male-uuid', display: 'Male' }],
        },
      });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-5')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.datatype).toBe('Coded');
      expect(result[0].value).toEqual({ uuid: 'male-uuid', display: 'Male', name: 'Male' });
    });

    it('should handle coded value without display', () => {
      const resource = baseResource('status-uuid', {
        valueCodeableConcept: {
          coding: [{ code: 'active-uuid' }],
        },
      });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-6')]);

      expect(result[0].value).toEqual({
        uuid: 'active-uuid',
        display: undefined,
        name: undefined,
      });
    });

    it('should emit a name so CodedControl has a label when the answer is unresolved', () => {
      // Regression (BAH-4812 review): if the saved answer is no longer among
      // the concept's current answers, CodedControl (CodedControl.jsx:127)
      // falls back to `{ ...val, name: val.name }` and then dereferences
      // `name.display` (line 96). Emitting `name` alongside `display` keeps a
      // readable label available and avoids the TypeError / blank label.
      const resource = baseResource('diagnosis-uuid', {
        valueCodeableConcept: {
          coding: [{ code: 'retired-answer-uuid', display: 'Retired Answer' }],
        },
      });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-6b')]);

      expect(result[0].value.name).toBe('Retired Answer');
      expect(result[0].value.name).toBe(result[0].value.display);
    });
  });

  describe('AC4 — Boolean observation', () => {
    it('should map valueBoolean true to boolean true', () => {
      const resource = baseResource('smoking-uuid', { valueBoolean: true });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-7')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.datatype).toBe('Boolean');
      expect(result[0].value).toBe(true);
    });

    it('should map valueBoolean false to boolean false', () => {
      const resource = baseResource('smoking-uuid', { valueBoolean: false });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-8')]);

      expect(result[0].value).toBe(false);
    });
  });

  describe('AC5 — Date observation', () => {
    it('should map valueDateTime to a date string', () => {
      const resource = baseResource('dob-uuid', { valueDateTime: '2000-05-15T00:00:00.000Z' });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-9')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.datatype).toBe('Date');
      expect(result[0].value).toBe('2000-05-15T00:00:00.000Z');
    });

    it('should map a plain date string (no time component)', () => {
      const resource = baseResource('dob-uuid', { valueDateTime: '1985-12-01' });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-10')]);

      expect(result[0].value).toBe('1985-12-01');
    });
  });

  describe('AC6 — Attachment / complex observation', () => {
    it('should map a native valueAttachment to { url, fileName, contentType }', () => {
      const resource = {
        ...baseResource('image-uuid', {}),
        valueAttachment: {
          url: 'http://example.com/image.jpg',
          title: 'image.jpg',
          contentType: 'image/jpeg',
        },
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'id-11')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.datatype).toBe('Complex');
      expect(result[0].value).toEqual({
        url: 'http://example.com/image.jpg',
        fileName: 'image.jpg',
        contentType: 'image/jpeg',
      });
    });

    it('should map an attachment stored in the value-attachment extension', () => {
      const resource = {
        ...baseResource('image-uuid', { valueString: 'http://example.com/scan.pdf' }),
        extension: [
          {
            url: FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
            valueAttachment: {
              url: 'http://example.com/scan.pdf',
              title: 'scan.pdf',
              contentType: 'application/pdf',
            },
          },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'id-12')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.datatype).toBe('Complex');
      expect(result[0].value).toEqual({
        url: 'http://example.com/scan.pdf',
        fileName: 'scan.pdf',
        contentType: 'application/pdf',
      });
    });

    it('should prefer extension attachment over valueString when both are present', () => {
      const resource = {
        ...baseResource('file-uuid', { valueString: 'http://example.com/file.jpg' }),
        extension: [
          {
            url: FHIR_OBSERVATION_VALUE_ATTACHMENT_URL,
            valueAttachment: {
              url: 'http://example.com/file.jpg',
              title: 'file.jpg',
              contentType: 'image/jpeg',
            },
          },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'id-13')]);

      expect(result[0].value.fileName).toBe('file.jpg');
      expect(result[0].value.url).toBe('http://example.com/file.jpg');
    });

    it('should NOT classify an attachment extension with a non-matching url as Complex', () => {
      // Regression (BAH-4812 review): the reverse used to match any extension
      // whose valueAttachment carried a missing/undefined url. An unrelated
      // sub-extension must not be mistaken for the Bahmni attachment extension.
      const resource = {
        ...baseResource('note-uuid', { valueString: 'plain text answer' }),
        extension: [
          {
            url: 'http://example.com/some-other-extension',
            valueAttachment: { url: 'http://example.com/unrelated.bin' },
          },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'id-14')]);

      expect(result[0].concept.datatype).toBe('Text');
      expect(result[0].value).toBe('plain text answer');
    });
  });

  describe('AC7 — Observation group (hasMember → groupMembers)', () => {
    it('should resolve hasMember references into groupMembers array', () => {
      const pulseEntry = makeEntry(
        baseResource('pulse-uuid', { valueQuantity: { value: 72 } }),
        'child-1'
      );
      const bpEntry = makeEntry(
        baseResource('bp-uuid', { valueQuantity: { value: 120 } }),
        'child-2'
      );
      const parentResource = {
        ...baseResource('vitals-uuid', {}),
        id: 'parent-1',
        hasMember: [
          { reference: pulseEntry.fullUrl, type: 'Observation' },
          { reference: bpEntry.fullUrl, type: 'Observation' },
        ],
      };
      const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:parent-1' };

      const result = getObservationsFromFhir([pulseEntry, bpEntry, parentEntry]);

      expect(result).toHaveLength(1);
      const parent = result[0];
      expect(parent.concept.uuid).toBe('vitals-uuid');
      expect(parent.groupMembers).toHaveLength(2);
      expect(parent.groupMembers[0].concept.uuid).toBe('pulse-uuid');
      expect(parent.groupMembers[0].value).toBe(72);
      expect(parent.groupMembers[1].concept.uuid).toBe('bp-uuid');
      expect(parent.groupMembers[1].value).toBe(120);
    });

    it('parent observation value should be null when it has groupMembers', () => {
      const childEntry = makeEntry(baseResource('leaf-uuid', { valueString: 'val' }), 'c1');
      const parentResource = {
        ...baseResource('group-uuid', {}),
        id: 'p1',
        hasMember: [{ reference: childEntry.fullUrl }],
      };
      const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:p1' };

      const result = getObservationsFromFhir([childEntry, parentEntry]);

      expect(result[0].value).toBeNull();
      expect(result[0].groupMembers).toHaveLength(1);
    });
  });

  describe('AC8 — Nested observation groups', () => {
    it('should recursively resolve nested hasMember into nested groupMembers', () => {
      const leafEntry = makeEntry(
        baseResource('leaf-uuid', { valueString: 'nested value' }),
        'leaf-1'
      );
      const innerResource = {
        ...baseResource('inner-uuid', {}),
        id: 'inner-1',
        hasMember: [{ reference: leafEntry.fullUrl }],
      };
      const innerEntry = { resource: innerResource, fullUrl: 'urn:uuid:inner-1' };
      const outerResource = {
        ...baseResource('outer-uuid', {}),
        id: 'outer-1',
        hasMember: [{ reference: innerEntry.fullUrl }],
      };
      const outerEntry = { resource: outerResource, fullUrl: 'urn:uuid:outer-1' };

      const result = getObservationsFromFhir([leafEntry, innerEntry, outerEntry]);

      expect(result).toHaveLength(1);
      const outer = result[0];
      expect(outer.concept.uuid).toBe('outer-uuid');
      expect(outer.groupMembers).toHaveLength(1);

      const inner = outer.groupMembers[0];
      expect(inner.concept.uuid).toBe('inner-uuid');
      expect(inner.groupMembers).toHaveLength(1);

      const leaf = inner.groupMembers[0];
      expect(leaf.concept.uuid).toBe('leaf-uuid');
      expect(leaf.value).toBe('nested value');
    });

    it('should support 3-level deep nesting', () => {
      const deepEntry = makeEntry(baseResource('deep-uuid', { valueQuantity: { value: 5 } }), 'd1');
      const l2Resource = { ...baseResource('l2-uuid', {}), id: 'l2', hasMember: [{ reference: deepEntry.fullUrl }] };
      const l2Entry = { resource: l2Resource, fullUrl: 'urn:uuid:l2' };
      const l1Resource = { ...baseResource('l1-uuid', {}), id: 'l1', hasMember: [{ reference: l2Entry.fullUrl }] };
      const l1Entry = { resource: l1Resource, fullUrl: 'urn:uuid:l1' };
      const topResource = { ...baseResource('top-uuid', {}), id: 'top', hasMember: [{ reference: l1Entry.fullUrl }] };
      const topEntry = { resource: topResource, fullUrl: 'urn:uuid:top' };

      const result = getObservationsFromFhir([deepEntry, l2Entry, l1Entry, topEntry]);

      expect(result).toHaveLength(1);
      expect(result[0].groupMembers[0].groupMembers[0].groupMembers[0].value).toBe(5);
    });
  });

  describe('AC9 — Clinician comment', () => {
    it('should map note[0].text to comment', () => {
      const resource = {
        ...baseResource('concept-uuid', { valueString: 'test' }),
        note: [{ text: 'This is a clinical note' }],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'id-c1')]);

      expect(result[0].comment).toBe('This is a clinical note');
    });

    it('should not include comment when note is absent', () => {
      const resource = baseResource('concept-uuid', { valueString: 'test' });
      const result = getObservationsFromFhir([makeEntry(resource, 'id-c2')]);

      expect(result[0].comment).toBeUndefined();
    });
  });

  describe('AC10 — Interpretation flag', () => {
    const makeWithInterpretation = (code, id) => ({
      ...baseResource('bp-uuid', { valueQuantity: { value: 140 } }),
      interpretation: [
        {
          coding: [
            {
              system: FHIR_OBSERVATION_INTERPRETATION_SYSTEM,
              code,
              display: CODE_TO_INTERPRETATION[code] || code,
            },
          ],
        },
      ],
      id,
    });

    it('should map code "A" to "Abnormal"', () => {
      const entry = makeEntry(makeWithInterpretation('A', 'i1'));
      const result = getObservationsFromFhir([entry]);

      expect(result[0].interpretation).toBe('Abnormal');
    });

    it('should map code "N" to "Normal"', () => {
      const entry = makeEntry(makeWithInterpretation('N', 'i2'));
      const result = getObservationsFromFhir([entry]);

      expect(result[0].interpretation).toBe('Normal');
    });

    it('should map code "H" to "High"', () => {
      const entry = makeEntry(makeWithInterpretation('H', 'i3'));
      const result = getObservationsFromFhir([entry]);

      expect(result[0].interpretation).toBe('High');
    });

    it('should map code "L" to "Low"', () => {
      const entry = makeEntry(makeWithInterpretation('L', 'i4'));
      const result = getObservationsFromFhir([entry]);

      expect(result[0].interpretation).toBe('Low');
    });

    it('should not include interpretation when absent', () => {
      const resource = baseResource('concept-uuid', { valueQuantity: { value: 80 } });
      const result = getObservationsFromFhir([makeEntry(resource, 'i5')]);

      expect(result[0].interpretation).toBeUndefined();
    });
  });

  describe('AC11 — Form namespace and field path', () => {
    it('should split the form-namespace-path extension on "^"', () => {
      const resource = {
        ...baseResource('concept-uuid', { valueString: 'test' }),
        extension: [
          {
            url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
            valueString: 'Bahmni^TestForm.1/1-0',
          },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'fp-1')]);

      expect(result[0].formNamespace).toBe('Bahmni');
      expect(result[0].formFieldPath).toBe('TestForm.1/1-0');
    });

    it('should not include formNamespace / formFieldPath when extension is absent', () => {
      const resource = baseResource('concept-uuid', { valueString: 'test' });
      const result = getObservationsFromFhir([makeEntry(resource, 'fp-2')]);

      expect(result[0].formNamespace).toBeUndefined();
      expect(result[0].formFieldPath).toBeUndefined();
    });

    it('should handle formFieldPath with multiple "/" characters', () => {
      const resource = {
        ...baseResource('concept-uuid', { valueString: 'test' }),
        extension: [
          {
            url: FHIR_OBSERVATION_FORM_NAMESPACE_PATH_URL,
            valueString: 'Bahmni^VitalsForm.3/2-0/pulse',
          },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'fp-3')]);

      expect(result[0].formNamespace).toBe('Bahmni');
      expect(result[0].formFieldPath).toBe('VitalsForm.3/2-0/pulse');
    });
  });

  describe('AC12 — Observation timestamp', () => {
    it('should map effectiveDateTime to obsDatetime', () => {
      const resource = {
        ...baseResource('concept-uuid', { valueString: 'test' }),
        effectiveDateTime: '2024-01-15T10:30:00.000Z',
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'ts-1')]);

      expect(result[0].obsDatetime).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should not include obsDatetime when effectiveDateTime is absent', () => {
      const resource = {
        resourceType: 'Observation',
        status: 'final',
        id: 'ts-2',
        code: makeConcept('c-uuid', 'Test'),
        valueString: 'val',
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'ts-2')]);

      expect(result[0].obsDatetime).toBeUndefined();
    });
  });

  describe('AC13 — Missing optional data', () => {
    it('should return only required fields when all optional fields are absent', () => {
      const resource = {
        resourceType: 'Observation',
        status: 'final',
        id: 'min-1',
        code: makeConcept('minimal-uuid', 'Minimal'),
        valueQuantity: { value: 42 },
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'min-1')]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('minimal-uuid');
      expect(result[0].value).toBe(42);
      expect(result[0].comment).toBeUndefined();
      expect(result[0].interpretation).toBeUndefined();
      expect(result[0].formNamespace).toBeUndefined();
      expect(result[0].formFieldPath).toBeUndefined();
      expect(result[0].groupMembers).toBeUndefined();
    });

    it('should include only the fields present in the FHIR resource', () => {
      const resource = {
        ...baseResource('concept-uuid', { valueString: 'val' }),
        note: [{ text: 'only comment' }],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'min-2')]);

      expect(result[0].comment).toBe('only comment');
      expect(result[0].interpretation).toBeUndefined();
      expect(result[0].formNamespace).toBeUndefined();
    });
  });

  describe('AC14 — Malformed / invalid input handling', () => {
    it('should return [] for null input', () => {
      expect(getObservationsFromFhir(null)).toEqual([]);
    });

    it('should return [] for undefined input', () => {
      expect(getObservationsFromFhir(undefined)).toEqual([]);
    });

    it('should return [] for empty array', () => {
      expect(getObservationsFromFhir([])).toEqual([]);
    });

    it('should return [] for a non-array non-Bundle value', () => {
      expect(getObservationsFromFhir('not-an-array')).toEqual([]);
      expect(getObservationsFromFhir(42)).toEqual([]);
      expect(getObservationsFromFhir(true)).toEqual([]);
    });

    it('should not throw and should skip a malformed observation resource', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const badEntry = { resource: null, fullUrl: 'urn:uuid:bad-1' };
      const goodEntry = makeEntry(baseResource('good-uuid', { valueQuantity: { value: 1 } }), 'good-1');

      let result;
      expect(() => {
        result = getObservationsFromFhir([badEntry, goodEntry]);
      }).not.toThrow();

      expect(result.some((o) => o.concept.uuid === 'good-uuid')).toBe(true);

      warnSpy.mockRestore();
    });

    it('should warn (not throw) when hasMember reference cannot be resolved', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const parentResource = {
        ...baseResource('group-uuid', {}),
        id: 'parent-bad',
        hasMember: [{ reference: 'urn:uuid:does-not-exist' }],
      };
      const parentEntry = { resource: parentResource, fullUrl: 'urn:uuid:parent-bad' };

      let result;
      expect(() => {
        result = getObservationsFromFhir([parentEntry]);
      }).not.toThrow();

      expect(warnSpy).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].groupMembers).toBeUndefined();

      warnSpy.mockRestore();
    });

    it('should return [] for an empty FHIR Bundle', () => {
      const bundle = { resourceType: 'Bundle', entry: [] };
      expect(getObservationsFromFhir(bundle)).toEqual([]);
    });
  });

  describe('FHIR Bundle input', () => {
    it('should accept a full FHIR Bundle and return observations', () => {
      const bundle = {
        resourceType: 'Bundle',
        type: 'searchset',
        entry: [
          makeEntry(baseResource('bp-uuid', { valueQuantity: { value: 120 } }), 'b1'),
          makeEntry(baseResource('temp-uuid', { valueQuantity: { value: 37 } }), 'b2'),
        ],
      };

      const result = getObservationsFromFhir(bundle);

      expect(result).toHaveLength(2);
      expect(result.map((o) => o.concept.uuid).sort()).toEqual(['bp-uuid', 'temp-uuid'].sort());
    });

    it('should handle a Bundle with missing entry array', () => {
      const bundle = { resourceType: 'Bundle' };
      expect(getObservationsFromFhir(bundle)).toEqual([]);
    });
  });

  describe('Concept metadata extraction', () => {
    it('should include concept display from code.text when available', () => {
      const resource = {
        resourceType: 'Observation',
        status: 'final',
        id: 'cm-1',
        code: {
          coding: [{ code: 'c-uuid', display: 'Coding Display' }],
          text: 'Code Text',
        },
        valueQuantity: { value: 1 },
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'cm-1')]);

      expect(result[0].concept.display).toBe('Code Text');
    });

    it('should fall back to coding[0].display when code.text is absent', () => {
      const resource = {
        resourceType: 'Observation',
        status: 'final',
        id: 'cm-2',
        code: {
          coding: [{ code: 'c-uuid', display: 'Coding Display' }],
        },
        valueQuantity: { value: 1 },
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'cm-2')]);

      expect(result[0].concept.display).toBe('Coding Display');
    });
  });

  describe('Multiple top-level observations', () => {
    it('should return all top-level observations in input order', () => {
      const entries = [
        makeEntry(baseResource('c1-uuid', { valueString: 'v1' }), 'multi-1'),
        makeEntry(baseResource('c2-uuid', { valueQuantity: { value: 42 } }), 'multi-2'),
        makeEntry(baseResource('c3-uuid', { valueBoolean: true }), 'multi-3'),
      ];

      const result = getObservationsFromFhir(entries);

      expect(result).toHaveLength(3);
      expect(result[0].value).toBe('v1');
      expect(result[1].value).toBe(42);
      expect(result[2].value).toBe(true);
    });
  });

  describe('Round-trip sanity (getFhirObservations → getObservationsFromFhir)', () => {
    const defaultOptions = {
      patientReference: { reference: 'Patient/patient-uuid' },
      encounterReference: { reference: 'Encounter/encounter-uuid' },
      performerReference: { reference: 'Practitioner/practitioner-uuid' },
    };

    it('should reconstruct scalar observations from FHIR entries produced by getFhirObservations', () => {
      const original = [
        {
          concept: { uuid: 'pulse-uuid', datatype: 'Numeric' },
          value: 72,
          obsDatetime: '2024-01-15T10:00:00.000Z',
          formNamespace: 'Bahmni',
          formFieldPath: 'Vitals.1/1-0',
          comment: 'Resting',
          interpretation: 'NORMAL',
        },
      ];

      const fhirEntries = getFhirObservations(original, defaultOptions);
      const roundTripped = getObservationsFromFhir(fhirEntries);

      expect(roundTripped).toHaveLength(1);
      const obs = roundTripped[0];
      expect(obs.concept.uuid).toBe('pulse-uuid');
      expect(obs.value).toBe(72);
      expect(obs.obsDatetime).toBe('2024-01-15T10:00:00.000Z');
      expect(obs.formNamespace).toBe('Bahmni');
      expect(obs.formFieldPath).toBe('Vitals.1/1-0');
      expect(obs.comment).toBe('Resting');
      expect(obs.interpretation).toBe('Normal');
    });

    it('should reconstruct boolean and text observations', () => {
      const original = [
        { concept: { uuid: 'smoker-uuid', datatype: 'Boolean' }, value: false },
        { concept: { uuid: 'notes-uuid', datatype: 'Text' }, value: 'feels better' },
      ];

      const fhirEntries = getFhirObservations(original, defaultOptions);
      const roundTripped = getObservationsFromFhir(fhirEntries);

      expect(roundTripped).toHaveLength(2);
      expect(roundTripped.find((o) => o.concept.uuid === 'smoker-uuid').value).toBe(false);
      expect(roundTripped.find((o) => o.concept.uuid === 'notes-uuid').value).toBe('feels better');
    });

    it('should reconstruct a group observation with its members', () => {
      const original = [
        {
          concept: { uuid: 'vitals-uuid' },
          groupMembers: [
            { concept: { uuid: 'pulse-uuid', datatype: 'Numeric' }, value: 72 },
            { concept: { uuid: 'bp-uuid', datatype: 'Numeric' }, value: 120 },
          ],
        },
      ];

      const fhirEntries = getFhirObservations(original, defaultOptions);
      const roundTripped = getObservationsFromFhir(fhirEntries);

      expect(roundTripped).toHaveLength(1);
      expect(roundTripped[0].concept.uuid).toBe('vitals-uuid');
      expect(roundTripped[0].groupMembers).toHaveLength(2);
      const memberUuids = roundTripped[0].groupMembers.map((m) => m.concept.uuid).sort();
      expect(memberUuids).toEqual(['bp-uuid', 'pulse-uuid']);
    });

    it('should reconstruct coded observations', () => {
      const original = [
        {
          concept: { uuid: 'gender-uuid', datatype: 'Coded' },
          value: { uuid: 'male-uuid', display: 'Male' },
        },
      ];

      const fhirEntries = getFhirObservations(original, defaultOptions);
      const roundTripped = getObservationsFromFhir(fhirEntries);

      expect(roundTripped[0].value).toEqual({
        uuid: 'male-uuid',
        display: 'Male',
        name: 'Male',
      });
    });

    it('should preserve a complex/attachment value on outbound→inbound round-trip', () => {
      const original = [
        { concept: { uuid: 'xray-uuid', datatype: 'Complex' }, value: 'http://files/xray.jpg' },
      ];

      const fhirEntries = getFhirObservations(original, defaultOptions);
      const roundTripped = getObservationsFromFhir(fhirEntries);

      expect(roundTripped[0].concept.datatype).toBe('Complex');
      expect(roundTripped[0].value).toEqual(
        expect.objectContaining({ url: 'http://files/xray.jpg' }),
      );
    });
  });

  describe('Edge cases and regressions', () => {
    it('does not throw when a Bundle contains null / non-object entries (AC14)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const good = makeEntry(baseResource('ok-uuid', { valueString: 'ok' }), 'ok-1');

      let result;
      expect(() => {
        result = getObservationsFromFhir({
          resourceType: 'Bundle',
          entry: [null, undefined, 42, good],
        });
      }).not.toThrow();

      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('ok-uuid');
      warnSpy.mockRestore();
    });

    it('warns and skips a top-level resource that throws during mapping, keeping siblings (AC14)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const boom = {
        resourceType: 'Observation',
        id: 'boom-1',
        get code() {
          throw new Error('boom');
        },
      };
      const boomEntry = { resource: boom, fullUrl: 'urn:uuid:boom-1' };
      const good = makeEntry(baseResource('safe-uuid', { valueQuantity: { value: 5 } }), 'safe-1');

      let result;
      expect(() => {
        result = getObservationsFromFhir([boomEntry, good]);
      }).not.toThrow();

      expect(warnSpy).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('safe-uuid');
      warnSpy.mockRestore();
    });

    it('warns and skips a group child that throws during mapping (AC14)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const boomChild = {
        resourceType: 'Observation',
        id: 'bc-1',
        get code() {
          throw new Error('boom');
        },
      };
      const boomChildEntry = { resource: boomChild, fullUrl: 'urn:uuid:bc-1' };
      const parent = {
        resourceType: 'Observation',
        id: 'gp-1',
        code: makeConcept('grp-uuid', 'Group'),
        hasMember: [{ reference: 'urn:uuid:bc-1' }],
      };
      const parentEntry = { resource: parent, fullUrl: 'urn:uuid:gp-1' };

      let result;
      expect(() => {
        result = getObservationsFromFhir([boomChildEntry, parentEntry]);
      }).not.toThrow();

      expect(warnSpy).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('grp-uuid');
      expect(result[0].groupMembers).toBeUndefined();
      warnSpy.mockRestore();
    });

    it('accepts a bare Observation[] and resolves hasMember via Observation/{id}', () => {
      const child = {
        resourceType: 'Observation',
        id: 'child-9',
        code: makeConcept('child-uuid', 'Child'),
        valueQuantity: { value: 9 },
      };
      const parent = {
        resourceType: 'Observation',
        id: 'parent-9',
        code: makeConcept('parent-uuid', 'Parent'),
        hasMember: [{ reference: 'Observation/child-9' }],
      };

      const result = getObservationsFromFhir([child, parent]);

      expect(result).toHaveLength(1);
      expect(result[0].concept.uuid).toBe('parent-uuid');
      expect(result[0].groupMembers).toHaveLength(1);
      expect(result[0].groupMembers[0].value).toBe(9);
    });

    it('resolves a hasMember reference given as a bare resource id', () => {
      const child = makeEntry(baseResource('bare-child-uuid', { valueQuantity: { value: 3 } }), 'bare-child');
      const parent = {
        resource: {
          resourceType: 'Observation',
          id: 'bare-parent',
          code: makeConcept('bare-parent-uuid', 'P'),
          hasMember: [{ reference: 'bare-child' }],
        },
        fullUrl: 'urn:uuid:bare-parent',
      };

      const result = getObservationsFromFhir([child, parent]);

      expect(result).toHaveLength(1);
      expect(result[0].groupMembers).toHaveLength(1);
      expect(result[0].groupMembers[0].value).toBe(3);
    });

    it('returns a null value with Coded datatype for an empty coding array (AC3)', () => {
      const resource = baseResource('empty-coded', { valueCodeableConcept: { coding: [] } });
      const result = getObservationsFromFhir([makeEntry(resource, 'ec-1')]);

      expect(result[0].concept.datatype).toBe('Coded');
      expect(result[0].value).toBeNull();
    });

    it('omits interpretation when the code is not in CODE_TO_INTERPRETATION (AC10)', () => {
      const resource = {
        ...baseResource('interp-x', { valueQuantity: { value: 1 } }),
        interpretation: [
          { coding: [{ system: FHIR_OBSERVATION_INTERPRETATION_SYSTEM, code: 'ZZ' }] },
        ],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'ix-1')]);

      expect(result[0].interpretation).toBeUndefined();
    });

    it('nests a shared child under both parents and excludes it from the top level (AC7)', () => {
      const child = makeEntry(baseResource('shared-uuid', { valueQuantity: { value: 1 } }), 'shared-1');
      const p1 = {
        resource: {
          resourceType: 'Observation',
          id: 'p1',
          code: makeConcept('p1-uuid', 'P1'),
          hasMember: [{ reference: 'urn:uuid:shared-1' }],
        },
        fullUrl: 'urn:uuid:p1',
      };
      const p2 = {
        resource: {
          resourceType: 'Observation',
          id: 'p2',
          code: makeConcept('p2-uuid', 'P2'),
          hasMember: [{ reference: 'urn:uuid:shared-1' }],
        },
        fullUrl: 'urn:uuid:p2',
      };

      const result = getObservationsFromFhir([child, p1, p2]);

      expect(result.map((o) => o.concept.uuid).sort()).toEqual(['p1-uuid', 'p2-uuid']);
      expect(result.find((o) => o.concept.uuid === 'p1-uuid').groupMembers[0].concept.uuid).toBe('shared-uuid');
      expect(result.find((o) => o.concept.uuid === 'p2-uuid').groupMembers[0].concept.uuid).toBe('shared-uuid');
    });

    it('treats an empty hasMember array as a scalar observation', () => {
      const resource = { ...baseResource('empty-grp', { valueQuantity: { value: 7 } }), hasMember: [] };
      const result = getObservationsFromFhir([makeEntry(resource, 'eg-1')]);

      expect(result[0].value).toBe(7);
      expect(result[0].groupMembers).toBeUndefined();
    });

    it('preserves all note entries as a newline-joined comment (AC9)', () => {
      const resource = {
        ...baseResource('multi-note', { valueString: 'x' }),
        note: [{ text: 'first note' }, { text: null }, { text: 'second note' }],
      };
      const result = getObservationsFromFhir([makeEntry(resource, 'mn-1')]);

      expect(result[0].comment).toBe('first note\nsecond note');
    });

    it('keeps CODE_TO_INTERPRETATION in sync with INTERPRETATION_TO_CODE', () => {
      Object.values(INTERPRETATION_TO_CODE).forEach(({ code, display }) => {
        expect(CODE_TO_INTERPRETATION[code]).toBe(display);
      });
    });
  });
});

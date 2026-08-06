import { buildFhirObservationTransactionBundle } from 'src/helpers/FhirBundleBuilder';

describe('FhirBundleBuilder', () => {
  const defaultOptions = {
    patientReference: { reference: 'Patient/patient-uuid' },
    encounterReference: { reference: 'Encounter/encounter-uuid' },
    performerReference: { reference: 'Practitioner/practitioner-uuid' },
  };

  const pulseConcept = { uuid: 'pulse-uuid', datatype: 'Numeric' };

  describe('buildFhirObservationTransactionBundle', () => {
    it('should throw when patientReference, encounterReference or performerReference are missing', () => {
      expect(() => buildFhirObservationTransactionBundle([], [], {})).toThrow();
      expect(() => buildFhirObservationTransactionBundle([], [], { patientReference: {} })).toThrow();
    });

    it('should return an empty transaction bundle for no current observations', () => {
      const bundle = buildFhirObservationTransactionBundle([], [], defaultOptions);
      expect(bundle).toEqual({ resourceType: 'Bundle', type: 'transaction', entry: [] });
    });

    it('should POST a new leaf observation with no uuid', () => {
      const current = [{ concept: pulseConcept, value: 72 }];
      const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);

      expect(bundle.entry).toHaveLength(1);
      const [entry] = bundle.entry;
      expect(entry.request).toEqual({ method: 'POST', url: 'Observation' });
      expect(entry.resource.valueQuantity).toEqual({ value: 72 });
      expect(entry.fullUrl).toMatch(/^urn:uuid:/);
    });

    it('should skip a new leaf observation with no value (empty addMore slot)', () => {
      const current = [{ concept: pulseConcept, value: null }];
      const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should skip a new leaf observation that is voided', () => {
      const current = [{ concept: pulseConcept, value: 72, voided: true }];
      const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should POST (not PUT) when a uuid is present but not found in previous', () => {
      const current = [{ concept: pulseConcept, uuid: 'unverified-uuid', value: 88 }];
      const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);

      expect(bundle.entry).toHaveLength(1);
      const [entry] = bundle.entry;
      expect(entry.request).toEqual({ method: 'POST', url: 'Observation' });
      expect(entry.resource.id).not.toBe('unverified-uuid');
    });

    it('should skip (not DELETE) a voided observation whose uuid is not found in previous', () => {
      const current = [{ concept: pulseConcept, uuid: 'unverified-uuid', voided: true }];
      const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should DELETE an existing leaf observation that is voided', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', voided: true }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);

      expect(bundle.entry).toHaveLength(1);
      const [entry] = bundle.entry;
      expect(entry.request).toEqual({ method: 'DELETE', url: 'Observation/obs-uuid' });
      expect(entry.resource).toEqual({ resourceType: 'Observation', id: 'obs-uuid' });
    });

    it('should omit an existing leaf observation whose value is unchanged', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should omit an existing leaf observation whose numeric-string value matches its numeric baseline', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: '72' }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should treat interpretation:null (rendered default) and undefined (never set) as equivalent', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value' }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value', interpretation: null }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should treat comment:null and undefined as equivalent', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value' }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value', comment: null }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
      expect(bundle.entry).toEqual([]);
    });

    it('should PUT an existing leaf observation whose value changed, echoing back previous status', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72, status: 'preliminary' }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 88 }];
      const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);

      expect(bundle.entry).toHaveLength(1);
      const [entry] = bundle.entry;
      expect(entry.request).toEqual({ method: 'PUT', url: 'Observation/obs-uuid' });
      expect(entry.resource.id).toBe('obs-uuid');
      expect(entry.resource.status).toBe('preliminary');
      expect(entry.resource.valueQuantity).toEqual({ value: 88 });
    });

    it('should attach basedOn to created and updated resources when provided', () => {
      const options = { ...defaultOptions, basedOnReference: { reference: 'ServiceRequest/sr-uuid' } };
      const current = [{ concept: pulseConcept, value: 72 }];
      const bundle = buildFhirObservationTransactionBundle(current, [], options);
      expect(bundle.entry[0].resource.basedOn).toEqual([{ reference: 'ServiceRequest/sr-uuid' }]);
    });

    describe('group members', () => {
      const groupConcept = { uuid: 'vitals-group-uuid', datatype: 'N/A' };

      it('should POST a brand-new group only when at least one child survives', () => {
        const current = [
          {
            concept: groupConcept,
            groupMembers: [
              { concept: pulseConcept, value: 72 },
              { concept: { uuid: 'temp-uuid' }, value: null },
            ],
          },
        ];
        const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);

        expect(bundle.entry).toHaveLength(2);
        const parentEntry = bundle.entry.find((e) => e.resource.hasMember);
        const childEntry = bundle.entry.find((e) => !e.resource.hasMember);
        expect(parentEntry.request.method).toBe('POST');
        expect(parentEntry.resource.hasMember).toEqual([{ reference: childEntry.fullUrl }]);
      });

      it('should not emit a brand-new group at all when no child survives', () => {
        const current = [
          {
            concept: groupConcept,
            groupMembers: [{ concept: pulseConcept, value: null }],
          },
        ];
        const bundle = buildFhirObservationTransactionBundle(current, [], defaultOptions);
        expect(bundle.entry).toEqual([]);
      });

      it('should cascade-DELETE an existing group when every child is removed', () => {
        const previous = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            groupMembers: [{ concept: pulseConcept, uuid: 'child-uuid', value: 72 }],
          },
        ];
        const current = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            groupMembers: [{ concept: pulseConcept, uuid: 'child-uuid', voided: true }],
          },
        ];
        const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);

        expect(bundle.entry).toHaveLength(2);
        const methods = bundle.entry.map((e) => e.request.method);
        expect(methods).toEqual(['DELETE', 'DELETE']);
      });

      it('should leave an existing group untouched when no child changed', () => {
        const previous = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            groupMembers: [{ concept: pulseConcept, uuid: 'child-uuid', value: 72 }],
          },
        ];
        const current = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            groupMembers: [{ concept: pulseConcept, uuid: 'child-uuid', value: 72 }],
          },
        ];
        const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
        expect(bundle.entry).toEqual([]);
      });

      it('should PUT an existing group with hasMember limited to new/changed children when one child changes', () => {
        const previous = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            status: 'preliminary',
            groupMembers: [
              { concept: pulseConcept, uuid: 'unchanged-child-uuid', value: 72 },
              { concept: { uuid: 'temp-uuid' }, uuid: 'changed-child-uuid', value: 36.5 },
            ],
          },
        ];
        const current = [
          {
            concept: groupConcept,
            uuid: 'group-uuid',
            groupMembers: [
              { concept: pulseConcept, uuid: 'unchanged-child-uuid', value: 72 },
              { concept: { uuid: 'temp-uuid' }, uuid: 'changed-child-uuid', value: 37.2 },
            ],
          },
        ];
        const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);

        expect(bundle.entry).toHaveLength(2);
        const parentEntry = bundle.entry.find((e) => e.resource.id === 'group-uuid');
        const childEntry = bundle.entry.find((e) => e.resource.id === 'changed-child-uuid');
        expect(parentEntry.request).toEqual({ method: 'PUT', url: 'Observation/group-uuid' });
        expect(parentEntry.resource.status).toBe('preliminary');
        expect(parentEntry.resource.hasMember).toEqual([{ reference: 'Observation/changed-child-uuid' }]);
        expect(childEntry.request).toEqual({ method: 'PUT', url: 'Observation/changed-child-uuid' });
      });

      it('should not PUT an outer group when an unchanged nested group is its only child', () => {
        const outerGroupConcept = { uuid: 'outer-group-uuid', datatype: 'N/A' };
        const innerObs = {
          concept: groupConcept,
          uuid: 'inner-group-uuid',
          groupMembers: [{ concept: pulseConcept, uuid: 'leaf-uuid', value: 72 }],
        };
        const previous = [{ concept: outerGroupConcept, uuid: 'outer-group-uuid', groupMembers: [innerObs] }];
        const current = [{ concept: outerGroupConcept, uuid: 'outer-group-uuid', groupMembers: [innerObs] }];
        const bundle = buildFhirObservationTransactionBundle(current, previous, defaultOptions);
        expect(bundle.entry).toEqual([]);
      });
    });
  });

});

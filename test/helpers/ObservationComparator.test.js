import { hasObservationChanges } from 'src/helpers/ObservationComparator';

describe('ObservationComparator', () => {
  const pulseConcept = { uuid: 'pulse-uuid', datatype: 'Numeric' };

  describe('hasObservationChanges', () => {
    it('should return false when nothing changed', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      expect(hasObservationChanges(current, previous)).toBe(false);
    });

    it('should return true for a new leaf observation with a value', () => {
      const current = [{ concept: pulseConcept, value: 72 }];
      expect(hasObservationChanges(current, [])).toBe(true);
    });

    it('should return false for an empty addMore slot with no uuid and no value', () => {
      const current = [{ concept: pulseConcept, value: null }];
      expect(hasObservationChanges(current, [])).toBe(false);
    });

    it('should return true when an existing leaf is voided', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', voided: true }];
      expect(hasObservationChanges(current, previous)).toBe(true);
    });

    it('should return true when an existing leaf value changed', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 88 }];
      expect(hasObservationChanges(current, previous)).toBe(true);
    });

    it('should treat interpretation null and undefined as equivalent', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value' }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value', interpretation: null }];
      expect(hasObservationChanges(current, previous)).toBe(false);
    });

    it('should treat comment null and undefined as equivalent', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value' }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 'text value', comment: null }];
      expect(hasObservationChanges(current, previous)).toBe(false);
    });

    it('should treat a numeric string equal to its numeric baseline', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: '72' }];
      expect(hasObservationChanges(current, previous)).toBe(false);
    });

    it('should still detect a real change between a numeric string and a different number', () => {
      const previous = [{ concept: pulseConcept, uuid: 'obs-uuid', value: 72 }];
      const current = [{ concept: pulseConcept, uuid: 'obs-uuid', value: '90' }];
      expect(hasObservationChanges(current, previous)).toBe(true);
    });

    it('should return false for an unchanged nested group', () => {
      const groupConcept = { uuid: 'vitals-group-uuid', datatype: 'N/A' };
      const outerGroupConcept = { uuid: 'outer-group-uuid', datatype: 'N/A' };
      const innerObs = {
        concept: groupConcept,
        uuid: 'inner-group-uuid',
        groupMembers: [{ concept: pulseConcept, uuid: 'leaf-uuid', value: 72 }],
      };
      const previous = [{ concept: outerGroupConcept, uuid: 'outer-group-uuid', groupMembers: [innerObs] }];
      const current = [{ concept: outerGroupConcept, uuid: 'outer-group-uuid', groupMembers: [innerObs] }];
      expect(hasObservationChanges(current, previous)).toBe(false);
    });

    it('should return true when a nested group child changed', () => {
      const groupConcept = { uuid: 'vitals-group-uuid', datatype: 'N/A' };
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
          groupMembers: [{ concept: pulseConcept, uuid: 'child-uuid', value: 88 }],
        },
      ];
      expect(hasObservationChanges(current, previous)).toBe(true);
    });

    it('should return true when every child of an existing group is removed (cascade delete)', () => {
      const groupConcept = { uuid: 'vitals-group-uuid', datatype: 'N/A' };
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
      expect(hasObservationChanges(current, previous)).toBe(true);
    });
  });
});

import { expect } from 'chai';
import MapperStore from 'src/helpers/MapperStore';
import { ObsMapper } from 'src/mapper/ObsMapper';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { ObsListMapper } from 'src/mapper/ObsListMapper';

describe('MapperStore', () => {
  context('getMapper', () => {
    let control;
    beforeEach(() => {
      control = { id: 1, type: 'obsControl', properties: {} };
    });

    it('should return obsMapper by default', () => {
      const mapper = MapperStore.getMapper(control);
      expect(mapper instanceof ObsMapper).to.eql(true);
    });

    it('should return obsListMapper if multiSelect property is enabled', () => {
      control.properties = { multiSelect: true };
      const mapper = MapperStore.getMapper(control);
      expect(mapper instanceof ObsListMapper).to.eql(true);
    });

    it('should return obsGroupMapper', () => {
      control.type = 'obsGroupControl';
      const mapper = MapperStore.getMapper(control);
      expect(mapper instanceof ObsGroupMapper).to.eql(true);
    });

    it('should return AbnormalObsGroupMapper if obsgroup is abnormal', () => {
      control.type = 'obsGroupControl';
      control.properties = { abnormal: true };
      const mapper = MapperStore.getMapper(control);
      expect(mapper instanceof AbnormalObsGroupMapper).to.eql(true);
    });
  });
});

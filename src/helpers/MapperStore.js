import { ObsMapper } from 'src/mapper/ObsMapper';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';

class MapperStore {

  getMapper(control) {
    if (control.type === 'obsControl' && control.properties.isMultiSelect) {
      return new ObsMapper();
    }

    if (control.type === 'obsGroupControl' && control.properties.isAbnormal) {
      return new AbnormalObsGroupMapper();
    }

    if (control.type === 'obsGroupControl') {
      return new ObsGroupMapper();
    }

    return new ObsMapper();
  }
}


export default new MapperStore();

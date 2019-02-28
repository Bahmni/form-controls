import { ObsMapper } from 'src/mapper/ObsMapper';
import { AbnormalObsGroupMapper } from 'src/mapper/AbnormalObsGroupMapper';
import { ObsGroupMapper } from 'src/mapper/ObsGroupMapper';
import { SectionMapper } from 'src/mapper/SectionMapper';
import { ObsListMapper } from 'src/mapper/ObsListMapper';
import { TableMapper } from 'src/mapper/TableMapper';

class MapperStore {

  getMapper(control) {
    if (control.type === 'obsControl' && control.properties.multiSelect) {
      return new ObsListMapper();
    }

    if (control.type === 'obsGroupControl' && control.properties.abnormal) {
      return new AbnormalObsGroupMapper();
    }

    if (control.type === 'obsGroupControl') {
      return new ObsGroupMapper();
    }

    if (control.type === 'section') {
      return new SectionMapper();
    }

    if (control.type === 'table') {
      return new TableMapper();
    }

    return new ObsMapper();
  }
}


export default new MapperStore();

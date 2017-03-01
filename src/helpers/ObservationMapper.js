import { Record, List } from 'immutable';
import MapperStore from 'src/helpers/MapperStore';

export default class ObservationMapper {
  from(records){
    return records.children.map((r)=>{
      let mapper = MapperStore.getMapper(r.control);
      return mapper.getData(r)
    }).toJS();
  }
}
import MapperStore from 'src/helpers/MapperStore';
import flattenDeep from 'lodash/flattenDeep';

export default class ObservationMapper {
  from(records){
    const result = records.children.map((r)=>{
      let mapper = MapperStore.getMapper(r.control);
      let data = mapper.getData(r);
      return data;
    });

    return flattenDeep(result.toJS());
  }
}
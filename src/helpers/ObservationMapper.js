import MapperStore from 'src/helpers/MapperStore';
import flattenDeep from 'lodash/flattenDeep';

export default class ObservationMapper {
  from(records) {
    const result = records.children.map((r) => {
      const mapper = MapperStore.getMapper(r.control);
      const data = mapper.getData(r);
      return data;
    });

    return flattenDeep(result.toJS());
  }
}

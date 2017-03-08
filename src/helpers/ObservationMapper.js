import MapperStore from 'src/helpers/MapperStore';
import flattenDeep from 'lodash/flattenDeep';

export default class ObservationMapper {
  from(records) {
    const result = records.children.map((r) => {
      const mapper = MapperStore.getMapper(r.control);
      return mapper.getData(r);
    });
    const filteredResult = result.filter(r => r.concept || !r.voided);

    return flattenDeep(filteredResult.toJS());
  }
}

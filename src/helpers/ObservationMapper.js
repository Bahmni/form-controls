import MapperStore from 'src/helpers/MapperStore';

export default class ObservationMapper {
  from(records){
    const result = records.children.map((r)=>{
      let mapper = MapperStore.getMapper(r.control);
      return mapper.getData(r);
    });

    return result.toJS();
  }
}
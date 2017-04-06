import ValueMapperStore from '../helpers/ValueMapperStore';

export class CodedValueMapper {

  getValue(control, value) {
    return value && value.displayString;
  }

  setValue(control, value) {
    const [answer] = control.concept.answers.filter(obj => obj.displayString === value);
    return answer;
  }

}


ValueMapperStore.registerValueMapper('Coded', new CodedValueMapper());

import ValueMapperStore from '../helpers/ValueMapperStore';

export class CodedMultiSelectValueMapper {

  getValue(control, value) {
    if (value === undefined) {
      return [];
    }
    const selectedValues = [];
    value.forEach(selectedValue => {
      const displayValue = selectedValue.displayString
        ? selectedValue.displayString : selectedValue.name.name;
      selectedValues.push(displayValue);
    });
    return selectedValues;
  }

  setValue(control, value) {
    if (value === undefined || !Array.isArray(value)) {
      return [];
    }
    const answer = control.concept.answers.filter(obj => value.includes(obj.displayString));
    return answer;
  }

}


ValueMapperStore.registerValueMapper('CodedMultiSelect', new CodedMultiSelectValueMapper());

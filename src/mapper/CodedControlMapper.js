
export default class CodedControlMapper {

  getValue(control, value) {
    return value && value.displayString;
  }

  setValue(control, value) {
    const [answer] = control.concept.answers.filter(obj => obj.displayString === value);
    return answer;
  }

}


export default class BooleanControlMapper {

  getValue(control, value) {
    const [option] = control.options.filter(opt => opt.value === value);
    return option && option.name;
  }

  setValue(control, value) {
    const [option] = control.options.filter(opt => opt.name === value);
    return option && option.value;
  }

}

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import 'src/helpers/componentStore';

export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.value = (props.value ? (props.multi ? props.value : props.value[0]) : null);
    this.optionsUrl = props.optionsUrl;
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  getOptions(input) {
    const { optionsUrl } = this.props;
    return httpInterceptor.get(optionsUrl + input)
      .then((data) => {
        return { options: data.results };
      });
  }

  getValue() {
    this.value = this.value ? (this.props.multi ? this.value : [this.value]) : [];
    return this.value;
  }

  handleChange(value) {
    this.value = value;
  }

  render() {
    let { value, labelKey, valueKey, asynchronous, options, multi, minimumInput } = this.props;
    value = value ? (multi ? value : value[0]) : null;
    let props = {
      backspaceRemoves: false,
      labelKey,
      minimumInput,
      onChange: this.handleChange,
      value,
      valueKey,

    };

    if (asynchronous) {
      return <div><Select.Async {...props} loadOptions={this.getOptions}/></div>;
    } else {
      return <div><Select {...props} options={options} />;</div>
    }
  }
}

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  labelKey: PropTypes.string,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  value: PropTypes.array,
  valueKey: PropTypes.string,
  multi: PropTypes.bool,
  minimumInput: PropTypes.number,
};

AutoComplete.defaultProps = {
  asynchronous: true,
  labelKey: 'display',
  minimumInput: 3,
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  valueKey: 'uuid',
  multi: false
};

window.componentStore.registerComponent('autoComplete', AutoComplete);


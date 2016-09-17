import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import 'src/helpers/componentStore';

export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    let value;
    if (props.value) {
      value = props.multi ? props.value : props.value[0];
    } else {
      value = null;
    }
    this.state = { value };
    this.optionsUrl = props.optionsUrl;
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getOptions(input) {
    const { optionsUrl } = this.props;
    return httpInterceptor.get(optionsUrl + input)
      .then((data) => {
        const options = data.results;
        return { options };
      });
  }

  getValue() {
    let value;
    if (this.state.value) {
      value = this.props.multi ? this.state.value : [this.state.value];
    } else {
      value = [];
    }
    return value;
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    const { labelKey, valueKey, asynchronous, options, multi, minimumInput } = this.props;
    const props = {
      backspaceRemoves: false,
      labelKey,
      minimumInput,
      multi,
      onChange: this.handleChange,
      value: this.state.value,
      valueKey,

    };

    if (asynchronous) {
      return <div><Select.Async {...props} loadOptions={this.getOptions} /></div>;
    }
    return <div><Select {...props} options={options} /></div>;
  }
}

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  labelKey: PropTypes.string,
  minimumInput: PropTypes.number,
  multi: PropTypes.bool,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  value: PropTypes.array,
  valueKey: PropTypes.string,
};

AutoComplete.defaultProps = {
  asynchronous: true,
  labelKey: 'display',
  minimumInput: 3,
  multi: false,
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  valueKey: 'uuid',
};

window.componentStore.registerComponent('autoComplete', AutoComplete);


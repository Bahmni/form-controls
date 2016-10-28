import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import 'src/helpers/componentStore';
import get from 'lodash/get';

export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.optionsUrl = props.optionsUrl;
    this.getValueFromProps = this.getValueFromProps.bind(this);
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: this.getValueFromProps(props) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: this.getValueFromProps(nextProps) });
  }

  getValueFromProps(props) {
    if (props.multi) {
      return get(props, 'value');
    }
    return get(props, 'value[0]');
  }

  getOptions(input) {
    const { optionsUrl } = this.props;
    return httpInterceptor.get(optionsUrl + input)
      .then((data) => {
        const options = data.results;
        return { options };
      }).catch(() => {
        const options = [];
        return { options };
      });
  }

  getValue() {
    if (this.state.value) {
      return this.props.multi ? this.state.value : [this.state.value];
    }
    return [];
  }

  handleChange(value) {
    this.setState({ value });
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  }

  render() {
    const { autofocus, disabled, labelKey, valueKey,
                  asynchronous, options, multi, minimumInput } = this.props;
    const props = {
      autofocus,
      backspaceRemoves: false,
      disabled,
      labelKey,
      minimumInput,
      multi,
      onChange: this.handleChange,
      value: this.state.value,
      valueKey,
    };

    if (asynchronous) {
      return (
        <div className="obs-control-select-wrapper">
          <Select.Async { ...props } loadOptions={ this.getOptions } />
        </div>
      );
    }
    return (
      <div className="obs-control-select-wrapper">
        <Select { ...props } options={ options } />
      </div>
    );
  }
}

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  labelKey: PropTypes.string,
  minimumInput: PropTypes.number,
  multi: PropTypes.bool,
  onSelect: PropTypes.func,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  value: PropTypes.array,
  valueKey: PropTypes.string,
};

AutoComplete.defaultProps = {
  asynchronous: true,
  autofocus: true,
  disabled: false,
  labelKey: 'display',
  minimumInput: 3,
  multi: false,
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  valueKey: 'uuid',
};

window.componentStore.registerComponent('autoComplete', AutoComplete);


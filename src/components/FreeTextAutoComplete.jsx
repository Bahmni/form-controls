import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import ComponentStore from 'src/helpers/componentStore';

export class FreeTextAutoComplete extends Component {
  constructor(props) {
    super(props);
    const { options, value } = props;
    this.state = { options, value };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.options !== newProps.options) {
      this.setState({ options: newProps.options, value: newProps.value });
    }
  }

  handleOnChange(value) {
    this.setState({ value });
    const { type, translationKey, locale } = this.props;
    this.props.onChange(value, type, translationKey, locale);
  }

  render() {
    const { options, value } = this.state;
    const { multi, clearable } = this.props;
    return (
      <Select.Creatable
        clearable={clearable}
        multi={multi}
        onChange={this.handleOnChange}
        options={options}
        value={value}
      />
    );
  }
}

FreeTextAutoComplete.propTypes = {
  clearable: PropTypes.bool.isRequired,
  locale: PropTypes.string,
  multi: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  translationKey: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

FreeTextAutoComplete.defaultProps = {
  multi: false,
  clearable: false,
};


ComponentStore.registerComponent('freeTextAutoComplete', FreeTextAutoComplete);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Creatable } from 'react-select';
import ComponentStore from 'src/helpers/componentStore';

export class FreeTextAutoComplete extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.options !== prevState.options) {
      return { options: nextProps.options, value: nextProps.value };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { options, value } = props;
    this.state = { options, value };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(value) {
    this.setState({ value });
    const { type, translationKey, locale } = this.props;
    this.props.onChange(value, type, translationKey, locale);
  }

  render() {
    const { options, value } = this.state;
    const { multi, clearable, backspaceRemoves, deleteRemoves } = this.props;
    return (
      <Creatable
        backspaceRemoves={backspaceRemoves}
        clearable={clearable}
        deleteRemoves={deleteRemoves}
        multi={multi}
        onChange={this.handleOnChange}
        options={options}
        value={value}
      />
    );
  }
}

FreeTextAutoComplete.propTypes = {
  backspaceRemoves: PropTypes.bool.isRequired,
  clearable: PropTypes.bool.isRequired,
  deleteRemoves: PropTypes.bool.isRequired,
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
  backspaceRemoves: false,
  deleteRemoves: false,
};


ComponentStore.registerComponent('freeTextAutoComplete', FreeTextAutoComplete);

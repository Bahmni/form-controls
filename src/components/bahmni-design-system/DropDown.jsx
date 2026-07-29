import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, FilterableMultiSelect } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export class DropDown extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
    this.handleChange = this.handleChange.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || value !== undefined || validateForm) {
      this.props.onValueChange(value, this._getErrors(value));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = !isEqual(this.props.value, nextProps.value);
    return (
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors ||
      this.props.enabled !== nextProps.enabled ||
      this.props.validate !== nextProps.validate ||
      this.props.hidden !== nextProps.hidden
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      this.setState({ hasErrors });
      this.props.onValueChange(this.props.value, errors);
      return;
    }

    if (this.props.validate !== prevProps.validate ||
        !isEqual(this.props.value, prevProps.value)) {
      const errors = this._getErrors(this.props.value);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }

    if (this.isValueChanged) {
      const errors = this._getErrors(this.props.value);
      this.props.onValueChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    return Validator.getErrors({ validations: this.props.validations, value });
  }

  _isCreateByAddMore() {
    return !!this.props.formFieldPath && this.props.formFieldPath.split('-')[1] !== '0';
  }

  handleChange({ selectedItem }) {
    const errors = this._getErrors(selectedItem);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(selectedItem, errors);
  }

  handleMultiSelectChange({ selectedItems }) {
    const errors = this._getErrors(selectedItems);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onValueChange(selectedItems, errors);
  }

  render() {
    const { conceptUuid, enabled, multiSelect, options, value } = this.props;
    if (multiSelect) {
      return (
        <FilterableMultiSelect
          id={conceptUuid || 'dropdown'}
          disabled={!enabled}
          invalid={this.state.hasErrors}
          items={options}
          itemToString={(item) => item?.name || ''}
          placeholder=""
          onChange={this.handleMultiSelectChange}
          selectedItems={value || []}
          titleText=""
        />
      );
    }
    return (
      <ComboBox
        id={conceptUuid || 'dropdown'}
        disabled={!enabled}
        invalid={this.state.hasErrors}
        items={options}
        itemToString={(item) => item?.name || ''}
        placeholder="Select"
        onChange={this.handleChange}
        selectedItem={value || null}
        titleText=""
        downshiftProps={{
          stateReducer: (state, { type, changes }) => {
            // Guard against accidental data loss: Carbon fires onChange(null) when the
            // user types a non-matching string and blurs the field. The X-clear button
            // calls onChange directly (bypassing Downshift), so this guard does not
            // block intentional clears.
            // InputBlur = '__input_blur__' in dev/test, 9 in production (Downshift internals)
            if (
              (type === 9 || type === '__input_blur__') &&
              changes.selectedItem === null &&
              state.selectedItem !== null
            ) {
              return {
                ...changes,
                selectedItem: state.selectedItem,
                inputValue: state.selectedItem?.name || '',
              };
            }
            return changes;
          },
        }}
      />
    );
  }
}

DropDown.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  hidden: PropTypes.bool,
  multiSelect: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.any,
};

DropDown.defaultProps = {
  enabled: true,
  validate: false,
  validateForm: false,
  validations: [],
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Textarea from 'react-textarea-autosize';

export class TextBox extends Component {
  static getErrors(value, props) {
    const validations = props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  static hasErrors(errors) {
    return !isEmpty(errors);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.validate) {
      const hasErrors = TextBox.hasErrors(TextBox.getErrors(nextProps.value, nextProps));
      if (prevState.hasErrors !== hasErrors) {
        return { hasErrors };
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    const errors = TextBox.getErrors(props.value, props) || [];
    const hasErrors = this._isCreateByAddMore() ? TextBox.hasErrors(errors) : false;
    this.state = { hasErrors };
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange(value, TextBox.getErrors(value, this.props));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.isValueChanged = this.props.value !== nextProps.value;
    if (this.props.enabled !== nextProps.enabled ||
      this.isValueChanged ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = TextBox.getErrors(this.props.value, this.props);
    if (TextBox.hasErrors(errors)) {
      this.props.onChange(this.props.value, errors);
    }
    if (this.isValueChanged) {
      this.props.onChange(this.props.value, errors);
    }
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  handleChange(e) {
    const value = e.target.value;
    const errors = TextBox.getErrors(value, this.props);
    this.setState({ hasErrors: TextBox.hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  render() {
    const defaultValue = this.props.value || '';
    return (
        <div className="obs-comment-section-wrap">
      <Textarea
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        disabled={!this.props.enabled}
        onChange={(e) => this.handleChange(e)}
        value={defaultValue}
      />
        </div>
    );
  }
}

TextBox.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

TextBox.defaultProps = {
  enabled: true,
};

ComponentStore.registerComponent('text', TextBox);

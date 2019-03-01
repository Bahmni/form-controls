import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { Async } from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import ComponentStore from 'src/helpers/componentStore';
import get from 'lodash/get';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

export class AutoComplete extends Component {
  static getErrors(value, validations) {
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  static hasErrors(errors) {
    return !isEmpty(errors);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value === prevState.value || nextProps.value === prevState.prevPropValue) {
      return null;
    }

    const value = get(nextProps, 'value');
    const errors = AutoComplete.getErrors(value, nextProps.validations);
    const hasErrors = AutoComplete.hasErrors(errors);

    const options = (prevState.options !== nextProps.options && !prevState.searchable) ?
      nextProps.options : prevState.options;

    return { value, hasErrors, options, searchable: nextProps.searchable, prevPropValue: value };
  }

  constructor(props) {
    super(props);
    this.optionsUrl = props.optionsUrl;
    this.childRef = undefined;
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
    const errors = AutoComplete.getErrors(props.value, props.validations) || [];
    const hasErrors = this._isCreateByAddMore() ? AutoComplete.hasErrors(errors) : false;
    this.state = {
      value: get(props, 'value'),
      hasErrors,
      options: (!props.asynchronous && props.minimumInput === 0) ? props.options : [],
      noResultsText: '',
      searchable: props.searchable,
      prevPropValue: get(props, 'value'),
    };
  }

  componentDidMount() {
    const { validations, value, validateForm, onValueChange } = this.props;

    if (this.state.hasErrors || value !== undefined || validateForm) {
      onValueChange(value, AutoComplete.getErrors(value, validations));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.value, nextProps.value) ||
      !isEqual(this.state.value, nextState.value) ||
      !isEqual(this.props.searchable, nextProps.searchable) ||
      this.state.hasErrors !== nextState.hasErrors ||
      !isEqual(this.state.options, nextState.options) ||
      this.state.noResultsText !== nextState.noResultsText ||
      this.props.enabled !== nextProps.enabled;
  }

  componentDidUpdate(prevProps, prevState) {
    if (isEqual(this.state.options, prevState.options)
      || this.state.hasErrors !== prevState.hasErrors) {
      return;
    }
    const errors = AutoComplete.getErrors(this.state.value, this.props.validations);
    if (AutoComplete.hasErrors(errors)) {
      this.props.onValueChange(this.state.value, errors);
    }
  }

  onInputChange(input) {
    if (input.length >= this.props.minimumInput) {
      this.setState({ options: this.props.options, noResultsText: 'No Results Found' });
    } else {
      this.setState({ options: [], noResultsText: 'Type to search' });
    }
  }

  getOptions(input = '') {
    const { optionsUrl, minimumInput } = this.props;
    if (input.length >= minimumInput) {
      return httpInterceptor.get(optionsUrl + input)
        .then((data) => {
          const options = data.results;
          return { options };
        }).catch(() => {
          const options = [];
          return { options };
        });
    }
    return Promise.resolve();
  }

  getValue() {
    if (this.state.value) {
      return this.props.multiSelect ? this.state.value : [this.state.value];
    }
    return [];
  }

  handleChange(value) {
    const { validations, asynchronous, minimumInput, onValueChange } = this.props;

    const errors = AutoComplete.getErrors(value, validations);
    if (!asynchronous && minimumInput !== 0) {
      this.setState({ options: [], noResultsText: '' });
    }
    this.setState({ value, hasErrors: AutoComplete.hasErrors(errors) });
    if (onValueChange) {
      onValueChange(value, errors);
    }
  }

  storeChildRef(ref) {
    if (ref) this.childRef = ref;
  }

  handleFocus() {
    if (this.childRef) {
      this.childRef.loadOptions('');
    }
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  render() {
    const { autoFocus, autoload, cache, enabled, filterOptions, labelKey, valueKey,
                  asynchronous, multiSelect, minimumInput, searchable } = this.props;
    const props = {
      autoFocus,
      backspaceRemoves: true,
      disabled: !enabled,
      filterOptions,
      labelKey,
      minimumInput,
      multi: multiSelect,
      onChange: this.handleChange,
      value: this.state.value,
      valueKey,
      searchable,
      matchProp: 'label',
    };
    const className =
      classNames('obs-control-select-wrapper', { 'form-builder-error': this.state.hasErrors });
    if (asynchronous) {
      return (
        <div className={className}>
          <Async
            { ...props }
            autoload={autoload}
            cache={cache}
            loadOptions={ this.getOptions }
            onFocus={ this.handleFocus }
            ref={this.storeChildRef}
          />
        </div>
      );
    }
    return (
      <div className={className}>
        <Select
          { ...props }
          noResultsText={this.state.noResultsText}
          onInputChange={this.onInputChange}
          options={ this.state.options }
          ref={ this.storeChildRef }
        />
      </div>
    );
  }
}

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoload: PropTypes.bool,
  cache: PropTypes.bool,
  enabled: PropTypes.bool,
  filterOptions: PropTypes.func,
  formFieldPath: PropTypes.string,
  labelKey: PropTypes.string,
  minimumInput: PropTypes.number,
  multiSelect: PropTypes.bool,
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  searchable: PropTypes.bool,
  validateForm: PropTypes.bool,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

AutoComplete.defaultProps = {
  asynchronous: true,
  autoFocus: false,
  autoload: false,
  cache: false,
  enabled: true,
  formFieldPath: '-0',
  labelKey: 'display',
  minimumInput: 2,
  multiSelect: false,
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  valueKey: 'uuid',
  searchable: true,
};

const descriptor = {
  control: AutoComplete,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};


ComponentStore.registerDesignerComponent('autoComplete', descriptor);

ComponentStore.registerComponent('autoComplete', AutoComplete);


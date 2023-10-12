import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import ComponentStore from 'src/helpers/componentStore';
import get from 'lodash/get';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { Util } from 'src/helpers/Util';


export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.optionsUrl = props.optionsUrl;
    this.terminologyServiceConfig = props.terminologyServiceConfig;
    this.childRef = undefined;
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
    this.debouncedOnInputChange = Util.debounce(this.onInputChange, 300);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = {
      value: get(props, 'value'),
      hasErrors,
      options: [],
      noResultsText: '',
    };
  }

  componentWillMount() {
    if (
      !this.props.asynchronous &&
      this.props.minimumInput === 0 &&
      !this.props.url
    ) {
      this.setState({ options: this.props.options });
    }
  }

  componentDidMount() {
    if (this.state.hasErrors || this.props.value !== undefined || this.props.validateForm) {
      this.props.onValueChange(this.props.value, this._getErrors(this.props.value));
    }
  }

  componentWillReceiveProps(nextProps) {
    const value = get(nextProps, 'value');
    const errors = this._getErrors(value);
    const hasErrors = this._hasErrors(errors);
    const options = (this.state.options !== nextProps.options && !this.props.searchable) ?
      nextProps.options : this.state.options;
    this.setState({ value, hasErrors, options });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props.value, nextProps.value) ||
      !isEqual(this.state.value, nextState.value) ||
      !isEqual(this.props.searchable, nextProps.searchable) ||
      (this.state.hasErrors !== nextState.hasErrors) ||
      !isEqual(this.state.options, nextState.options) ||
      this.state.noResultsText !== nextState.noResultsText ||
      this.props.enabled !== nextProps.enabled;
  }

  componentWillUpdate(nextState) {
    return !isEqual(this.state.options, nextState.options)
      || this.state.hasErrors !== nextState.hasErrors;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.state.value);
    if (this._hasErrors(errors)) {
      this.props.onValueChange(this.state.value, errors);
    }
  }

  onInputChange(input) {
    const { options, url } = this.props;
    const { getAnswers, formatConcepts } = Util;

    if (input.length < this.props.minimumInput) {
      this.setState({ options: [], noResultsText: 'Type to search' });
      return;
    }

    if (url) {
      getAnswers(url, input, this.terminologyServiceConfig.limit || 30)
        .then(data => {
          const responses = formatConcepts(data);
          this.setState({
            options: responses,
            noResultsText: 'No Results Found',
          });
        })
        .catch(() => {
          this.setState({ options: [], noResultsText: 'No Results Found' });
        });
    } else {
      const searchedInputs = input.trim().split(' ');
      const filteredOptions = options.filter(option =>
        searchedInputs.every(searchedInput =>
          option.name.match(new RegExp(searchedInput, 'gi'))
        )
      );
      this.setState({
        options: filteredOptions,
        noResultsText: 'No Results Found',
      });
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
      const value = this.props.multiSelect ? this.state.value : [this.state.value];
      return value.map(val => ({ ...val, uuid: val.uuid || val.value }));
    }
    return [];
  }

  handleChange(value) {
    const errors = this._getErrors(value);
    if (!this.props.asynchronous && this.props.minimumInput !== 0) {
      this.setState({ options: [], noResultsText: '' });
    }
    this.setState({ value, hasErrors: this._hasErrors(errors) });
    if (this.props.onValueChange) {
      this.props.onValueChange(value, errors);
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

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  render() {
    const { autofocus, autoload, cache, enabled, filterOptions, labelKey, valueKey,
      asynchronous, multiSelect, minimumInput, searchable } = this.props;
    const props = {
      autofocus,
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
          <Select.Async
            {...props}
            autoload={autoload}
            cache={cache}
            loadOptions={this.getOptions}
            onFocus={this.handleFocus}
            ref={this.storeChildRef}
          />
        </div>
      );
    }
    return (
      <div className={className}>
        <Select
          {...props}
          filterOptions={null}
          noResultsText={this.state.noResultsText}
          onInputChange={this.debouncedOnInputChange}
          options={this.state.options}
          ref={this.storeChildRef}
        />
      </div>
    );
  }
}

AutoComplete.propTypes = {
  asynchronous: PropTypes.bool,
  autofocus: PropTypes.bool,
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
  terminologyServiceConfig: PropTypes.object,
  url: PropTypes.string,
  validateForm: PropTypes.bool,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

AutoComplete.defaultProps = {
  asynchronous: true,
  autofocus: false,
  autoload: false,
  cache: false,
  enabled: true,
  formFieldPath: '-0',
  labelKey: 'display',
  minimumInput: 3,
  multiSelect: false,
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  url: '',
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


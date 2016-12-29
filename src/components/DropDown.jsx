import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import ComponentStore from 'src/helpers/componentStore';
import get from 'lodash/get';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';


export class DropDown extends Component {
  constructor(props) {
    super(props);
    this.optionsUrl = props.optionsUrl;
    this.childRef = undefined;
    this.getValue = this.getValue.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.storeChildRef = this.storeChildRef.bind(this);
    this.state = {
      value: get(props, 'value'),
      hasErrors: false,
      options: get(props, 'options'),
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = get(nextProps, 'value');
    const errors = this._getErrors(value);
    const hasErrors = this._hasErrors(errors);
    this.setState({ value, hasErrors });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.value, nextProps.value) ||
        !isEqual(this.state.value, nextState.value) ||
        this.state.hasErrors !== nextState.hasErrors ||
        this.state.options !== nextState.options) {
      return true;
    }
    return false;
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
    return this.state.value;
  }

  handleChange(value) {
    const errors = this._getErrors(value);
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


  render() {
    const { autofocus,
            disabled,
            labelKey,
            valueKey,
          } = this.props;
    const props = {
      autofocus,
      backspaceRemoves: false,
      disabled,
      labelKey,
      onChange: this.handleChange,
      value: this.state.value,
      valueKey,
    };
    const className =
      classNames('obs-control-select-wrapper', { 'form-builder-error': this.state.hasErrors });
    return (
      <div className={className}>
        <Select { ...props }
          options={ this.state.options }
        />
      </div>
    );
  }
}

DropDown.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  labelKey: PropTypes.string,
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  optionsUrl: PropTypes.string,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

DropDown.defaultProps = {
  autofocus: false,
  disabled: false,
  labelKey: 'display',
  optionsUrl: '/openmrs/ws/rest/v1/concept?v=full&q=',
  valueKey: 'uuid',
};

const descriptor = {
  control: DropDown,
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


ComponentStore.registerDesignerComponent('dropDown', descriptor);

ComponentStore.registerComponent('dropDown', DropDown);


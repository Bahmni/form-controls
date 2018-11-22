import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';
import find from 'lodash/find';

export class Provider extends Component {

  constructor(props) {
    super(props);
    this.state = { providerData: [] };
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    const { properties } = this.props;
    const url = properties.URL || '/openmrs/ws/rest/v1/provider?v=custom:(id,name,uuid)';
    httpInterceptor
      .get(url)
      .then((data) => this.setState({ providerData: data.results }))
      .catch(() => {
        this.props.showNotification('Failed to fetch provider data', Constants.messageType.error);
      });
  }

  onValueChange(value, errors) {
    const updatedValue = value ? value.id : undefined;
    this.props.onChange(updatedValue, errors);
  }

  _getValue(val) {
    return find(this.state.providerData, (provider) => provider.id === val);
  }

  render() {
    const value = this.props.value ? this._getValue(parseInt(this.props.value, 10)) : undefined;
    const { properties } = this.props;
    const isSearchable = (properties.style === 'autocomplete');
    const minimumInput = isSearchable ? 2 : 0;
    return (
        <AutoComplete {...this.props}
          asynchronous={false}
          minimumInput={minimumInput}
          onValueChange={this.onValueChange}
          options={this.state.providerData}
          searchable={isSearchable}
          value={value}
        />
    );
  }
}

Provider.propTypes = {
  addMore: PropTypes.bool,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

Provider.defaultProps = {
  autofocus: false,
  enabled: true,
  labelKey: 'name',
  valueKey: 'id',
  searchable: false,
};

ComponentStore.registerComponent('ProviderObsHandler', Provider);

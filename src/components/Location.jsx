import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';
import find from 'lodash/find';

export class Location extends Component {

  constructor(props) {
    super(props);
    this.state = { locationData: [] };
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    const { properties } = this.props;
    const url = properties.URL || '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)';
    httpInterceptor
      .get(url)
      .then((data) => this.setState({ locationData: data.results }))
      .catch(() => {
        this.props.showNotification('Failed to fetch location data', Constants.messageType.error);
      });
  }

  onValueChange(value, errors) {
    const updatedValue = value ? value.id : undefined;
    this.props.onChange(updatedValue, errors);
  }

  _getValue(val) {
    return find(this.state.locationData, (location) => location.id === val);
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
          options={this.state.locationData}
          searchable={isSearchable}
          value={value}
        />
    );
  }
}

Location.propTypes = {
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

Location.defaultProps = {
  autofocus: false,
  enabled: true,
  labelKey: 'name',
  valueKey: 'id',
  searchable: false,
};

ComponentStore.registerComponent('LocationObsHandler', Location);

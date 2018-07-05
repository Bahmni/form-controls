import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

export class LocationDesigner extends Component {

  constructor(props) {
    super(props);
    this.state = { locationData: [] };
  }

  componentDidMount() {
    const { metadata: { properties }, setError } = this.props;
    const defaultUrl = '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)';
    const url = properties.URL || defaultUrl;
    httpInterceptor
      .get(url)
      .then((data) => this.setState({ locationData: data.results }))
      .catch(() => {
        if (setError) {
          setError({ message: 'Invalid Location URL' });
        }
      });
  }

  render() {
    const labelKey = 'name';
    const valueKey = 'id';
    const { properties } = this.props.metadata;
    const isSearchable = (properties.style === 'autocomplete');
    const minimumInput = isSearchable ? 2 : 0;
    return (
        <AutoComplete
          asynchronous={false}
          enabled
          labelKey={labelKey}
          minimumInput={minimumInput}
          options={this.state.locationData}
          searchable={isSearchable}
          valueKey={valueKey}
        />
    );
  }
}

LocationDesigner.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string,
  }),
  setError: PropTypes.func,
};

const descriptor = {
  control: LocationDesigner,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'URL',
            dataType: 'string',
            defaultValue: '/openmrs/ws/rest/v1/location?v=custom:(id,name,uuid)',
            elementType: 'text',
          },
          {
            name: 'style',
            dataType: 'string',
            defaultValue: 'dropdown',
            elementType: 'dropdown',
            options: ['autocomplete', 'dropdown'],
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('LocationObsHandler', descriptor);

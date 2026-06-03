import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { httpInterceptor } from 'src/helpers/httpInterceptor';

export class SurgicalBlockDesigner extends Component {

  constructor(props) {
    super(props);
    this.state = { surgeryOptions: [] };
  }

  componentDidMount() {
    const { setError } = this.props;
    const now = moment();
    const oneMonthAgo = moment().subtract(1, 'months').startOf('day');

    const startDatetime = encodeURIComponent(oneMonthAgo.format('YYYY-MM-DDTHH:mm:ss.SSSZZ'));
    const endDatetime = encodeURIComponent(now.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'));

    const url = '/openmrs/ws/rest/v1/surgicalBlock' +
      '?activeBlocks=true' +
      `&startDatetime=${startDatetime}` +
      `&endDatetime=${endDatetime}` +
      '&includeVoided=false' +
      '&v=custom:(id,uuid,' +
      'provider:(uuid,person:(uuid,display),attributes:(attributeType:(display),value,voided)),' +
      'location:(uuid,name),startDatetime,endDatetime,' +
      'surgicalAppointments:(id,uuid,patient:(uuid,display,' +
      'person:(age,gender,birthdate)),' +
      'actualStartDatetime,actualEndDatetime,status,notes,sortWeight,' +
      'bedNumber,bedLocation,surgicalAppointmentAttributes,patientObservations))';

    httpInterceptor
      .get(url)
      .then((data) => {
        const options = (data.results || []).map((block) => {
          const date = moment(block.startDatetime).format('DD/MM/YYYY');
          const surgeon = block.provider && block.provider.person
            ? block.provider.person.display : '';
          return { id: block.uuid, name: `${date} - ${surgeon}` };
        });
        this.setState({ surgeryOptions: options });
      })
      .catch(() => {
        if (setError) {
          setError({ message: 'Invalid Surgical Block URL' });
        }
      });
  }

  render() {
    const { properties } = this.props.metadata;
    const isSearchable = (properties.style === 'autocomplete');
    const minimumInput = isSearchable ? 2 : 0;
    return (
      <AutoComplete
        asynchronous={false}
        enabled
        labelKey="name"
        minimumInput={minimumInput}
        options={this.state.surgeryOptions}
        searchable={isSearchable}
        valueKey="id"
      />
    );
  }
}

SurgicalBlockDesigner.propTypes = {
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
  control: SurgicalBlockDesigner,
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

ComponentStore.registerDesignerComponent('SurgicalBlockObsHandler', descriptor);

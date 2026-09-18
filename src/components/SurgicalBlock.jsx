import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Util } from 'src/helpers/Util';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';
import { httpInterceptor } from 'src/helpers/httpInterceptor';
import Constants from 'src/constants';
import find from 'lodash/find';

export class SurgicalBlock extends Component {

  constructor(props) {
    super(props);
    this.state = { surgeryOptions: [] };
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    const { properties } = this.props;
    const defaultUrl = '/openmrs/ws/rest/v1/surgicalBlock' +
      '?activeBlocks=true' +
      '&startDatetime={NOW-30d}' +
      '&endDatetime={NOW}' +
      '&includeVoided=false' +
      '&v=custom:(id,uuid,' +
      'provider:(uuid,person:(uuid,display),attributes:(attributeType:(display),value,voided)),' +
      'location:(uuid,name),startDatetime,endDatetime,' +
      'surgicalAppointments:(id,uuid,order:(uuid),patient:(uuid,display,' +
      'person:(age,gender,birthdate)),' +
      'actualStartDatetime,actualEndDatetime,status,notes,sortWeight,' +
      'bedNumber,bedLocation,surgicalAppointmentAttributes,patientObservations))';

    const url = Util.resolveUrlTokens(properties.URL || defaultUrl);

    httpInterceptor
      .get(url)
      .then((data) => {
        const { patientUuid } = this.props;
        const surgeryOptions = [];
        (data.results || []).forEach((block) => {
          (block.surgicalAppointments || []).forEach((surgicalAppointment) => {
            const orderUuid = surgicalAppointment.order && surgicalAppointment.order.uuid;
            if (!orderUuid) return;
            if (!patientUuid || (surgicalAppointment.patient &&
                surgicalAppointment.patient.uuid === patientUuid)) {
              surgeryOptions.push(this._formatSurgeryOption(block, surgicalAppointment));
            }
          });
        });
        this.setState({ surgeryOptions });
      })
      .catch(() => {
        this.props.showNotification('Failed to fetch surgical blocks', Constants.messageType.error);
      });
  }

  onValueChange(value, errors) {
    const updatedValue = value ? value.id : undefined;
    this.props.onChange({ value: updatedValue, errors });
  }

  _formatSurgeryOption(block, surgicalAppointment) {
    const date = this._formatDate(block.startDatetime);
    const surgeon = block.provider && block.provider.person
      ? block.provider.person.display : '';
    return { id: surgicalAppointment.order.uuid, name: `${date} - ${surgeon}` };
  }

  _formatDate(datetime) {
    if (!datetime) return '';
    return moment(datetime).format('DD/MM/YYYY');
  }

  _getValue(savedValue) {
    return find(this.state.surgeryOptions, (option) => option.id === savedValue);
  }

  render() {
    const value = this.props.value ? this._getValue(this.props.value) : undefined;
    const { properties } = this.props;
    const isSearchable = (properties.style === 'autocomplete');
    const minimumInput = isSearchable ? 2 : 0;
    return (
      <AutoComplete {...this.props}
        asynchronous={false}
        minimumInput={minimumInput}
        onValueChange={this.onValueChange}
        options={this.state.surgeryOptions}
        searchable={isSearchable}
        value={value}
      />
    );
  }
}

SurgicalBlock.propTypes = {
  addMore: PropTypes.bool,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

SurgicalBlock.defaultProps = {
  autofocus: false,
  enabled: true,
  labelKey: 'name',
  valueKey: 'id',
  searchable: false,
};

ComponentStore.registerComponent('SurgicalBlockObsHandler', SurgicalBlock);

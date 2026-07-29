import { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, DatePickerInput, TimePicker } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

function parseDateTime(value) {
  if (!value || typeof value !== 'string') {
    return { dateValue: undefined, timeValue: '' };
  }
  const parts = value.split(' ');
  const rawTime = parts[1] || '';
  let dateValue;
  if (parts[0]) {
    const [y, m, d] = parts[0].split('-');
    dateValue = new Date(Number(y), Number(m) - 1, Number(d));
  }
  return {
    dateValue,
    timeValue: rawTime.substring(0, 5),
  };
}

export class DateTime extends Component {
  constructor(props) {
    super(props);
    const { dateValue, timeValue } = parseDateTime(props.value);
    this.state = {
      hasErrors: false,
      dateValue,
      timeValue,
      _propsValue: props.value,
      _selfReportedValue: props.value,
      _timeKey: 0,
    };
    this.datePickerRef = null;
    this.timePickerRef = null;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state._propsValue) {
      const isSelfChange = props.value === state._selfReportedValue;
      const { dateValue, timeValue } = parseDateTime(props.value);
      return {
        dateValue,
        timeValue,
        _propsValue: props.value,
        _timeKey: isSelfChange ? state._timeKey : state._timeKey + 1,
      };
    }
    return null;
  }

  componentDidMount() {
    const { value, validateForm } = this.props;
    if (this.state.hasErrors || typeof value !== 'undefined' || validateForm) {
      this.props.onChange({
        value,
        errors: this._getAllErrors(this.state.dateValue, this.state.timeValue),
        triggerControlEvent: false,
        calledOnMount: true,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.enabled !== nextProps.enabled ||
        this.props.validate !== nextProps.validate ||
        this.props.value !== nextProps.value ||
        !isEqual(this.state, nextState) ||
        this.props.hidden !== nextProps.hidden) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hidden && !this.props.hidden && this.props.validateForm) {
      const errors = this._getAllErrors(this.state.dateValue, this.state.timeValue);
      const hasErrors = this._hasErrors(errors);
      this.setState({ hasErrors });
      this.props.onChange({ value: this.props.value, errors, calledOnMount: true });
      return;
    }

    if (this.props.validate !== prevProps.validate) {
      const { dateValue, timeValue } = this.state;
      const errors = this._getAllErrors(dateValue, timeValue);
      const hasErrors = this._hasErrors(errors);
      if (this.state.hasErrors !== hasErrors) {
        this.setState({ hasErrors });
      }
    }
  }

  _parseValue(value) {
    return parseDateTime(value);
  }

  _formatDateTime(dateValue, timeValue) {
    if (!dateValue || !timeValue) {
      return undefined;
    }
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${timeValue}`;
  }

  handleDateChange(dates) {
    try {
      // Carbon's DatePicker onChange receives an array of Date objects
      if (!dates || !Array.isArray(dates) || dates.length === 0) {
        this.setState({ dateValue: undefined }, this.updateParent);
        return;
      }

      const selectedDate = dates[0];
      if (!selectedDate) {
        this.setState({ dateValue: undefined }, this.updateParent);
        return;
      }

      this.setState({ dateValue: selectedDate }, this.updateParent);
    } catch (error) {
      console.error('Error in handleDateChange:', error);
      this.setState({ dateValue: undefined }, this.updateParent);
    }
  }

  handleTimeChange(e) {
    const timeValue = e.target.value;
    this.setState({ timeValue }, this.updateParent);
  }

  updateParent = () => {
    const { dateValue, timeValue } = this.state;
    const errors = this._getAllErrors(dateValue, timeValue);
    const dateTimeValue = this._formatDateTime(dateValue, timeValue);
    this.setState({ hasErrors: this._hasErrors(errors), _selfReportedValue: dateTimeValue });
    this.props.onChange({ value: dateTimeValue, errors });
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getAllErrors(dateValue, timeValue) {
    if (!dateValue && !timeValue) {
      return [];
    }
    if ((dateValue && !timeValue) || (!dateValue && timeValue)) {
      return [{ message: 'Both date and time are required' }];
    }
    const validations = this.props.validations;
    const value = this._formatDateTime(dateValue, timeValue);
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  render() {
    const { conceptUuid, label } = this.props;
    const { dateValue, timeValue, hasErrors, _timeKey } = this.state;
    const displayHasErrors = hasErrors;

    return (
      <div className={classNames('datetime-control', {
        'form-builder-error': displayHasErrors
      })}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <DatePicker
              datePickerType="single"
              dateFormat="Y-m-d"
              value={dateValue}
              onChange={(dates) => this.handleDateChange(dates)}
              ref={(ref) => { this.datePickerRef = ref; }}
            >
              <DatePickerInput
                id={`${conceptUuid}-date`}
                labelText={label ? `${label} (Date)` : 'Date'}
                placeholder="yyyy-mm-dd"
                size="sm"
                disabled={!this.props.enabled}
                invalid={displayHasErrors}
              />
            </DatePicker>
          </div>
          <div style={{ flex: 1 }}>
            <TimePicker
              key={_timeKey}
              id={`${conceptUuid}-time`}
              labelText={label ? `${label} (Time)` : 'Time'}
              value={timeValue}
              onChange={(e) => this.handleTimeChange(e)}
              size="sm"
              disabled={!this.props.enabled}
              invalid={displayHasErrors}
              ref={(ref) => { this.timePickerRef = ref; }}
            />
          </div>
        </div>
      </div>
    );
  }
}

DateTime.propTypes = {
  conceptUuid: PropTypes.string,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

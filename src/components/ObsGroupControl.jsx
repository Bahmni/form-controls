import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import classNames from 'classnames';
import addMoreDecorator from './AddMoreDecorator';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

export class ObsGroupControl extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapse !== undefined && (nextProps.collapse !== this.props.collapse ||
      nextProps.collapse !== this.state.collapse)) {
      this.setState({ collapse: nextProps.collapse });
    }
  }

  onChange(formFieldPath, value, errors, onActionDone) {
    this.props.onValueChanged(formFieldPath, value, errors, onActionDone);
  }

  onControlAdd(formFieldPath) {
    this.props.onControlAdd(formFieldPath);
  }

  onControlRemove(formFieldPath) {
    this.props.onControlRemove(formFieldPath);
  }

  _onCollapse() {
    const collapse = !this.state.collapse;
    this.setState({ collapse });
  }

  render() {
    const {
      collapse,
      formName,
      formVersion,
      metadata: { label },
      onEventTrigger,
      validate,
      validateForm,
      patientUuid,
      showNotification,
    } = this.props;
    const childProps = {
      collapse,
      enabled: this.props.enabled,
      formName,
      formVersion,
      validate,
      validateForm,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
      onEventTrigger,
      onValueChanged: this.onChange,
      patientUuid,
      showNotification,
    };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const toggleClass = `form-builder-toggle ${classNames({ active: !this.state.collapse })}`;
    const obsGroupClass =
      this.state.collapse ? 'closing-group-controls' : 'active-group-controls';
    const disableClass = this.props.enabled ? '' : ' disabled';
    const hiddenClass = !this.props.hidden ? '' : 'hidden';
    return (
      <fieldset className={ classNames('form-builder-fieldset', `${hiddenClass}`) }>
        <legend className={`${toggleClass}${disableClass}`} onClick={ this._onCollapse}>
          <i className="fa fa-caret-down"></i>
          <i className="fa fa-caret-right"></i>
          <strong>
            <FormattedMessage
              defaultMessage={label.value}
              id={label.translationKey || 'defaultId'}
            />
          </strong>
        </legend>
        {this.showAddMore()}
        <div className={`obsGroup-controls ${obsGroupClass}${disableClass}`}>
          { displayRowControls(groupedRowControls, this.props.children.toArray(), childProps) }
        </div>
      </fieldset>
    );
  }
}

ObsGroupControl.propTypes = {
  children: PropTypes.any,
  collapse: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    concept: PropTypes.object.isRequired,
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
  }),
  onControlAdd: PropTypes.func,
  onControlRemove: PropTypes.func,
  onEventTrigger: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showAddMore: PropTypes.bool.isRequired,
  showNotification: PropTypes.func.isRequired,
  showRemove: PropTypes.bool.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
};

ObsGroupControl.defaultProps = {
  enabled: true,
  hidden: false,
  showAddMore: false,
  showRemove: false,
  children: List.of([]),
};

ComponentStore.registerComponent('obsGroupControl', ObsGroupControl);

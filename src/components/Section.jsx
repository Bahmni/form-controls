import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';
import ComponentStore from 'src/helpers/componentStore';
import { getGroupedControls, displayRowControls } from '../helpers/controlsParser';
import addMoreDecorator from './AddMoreDecorator';
import { FormattedMessage } from 'react-intl';

export class Section extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
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
      enabled,
      formName,
      formVersion,
      metadata: { label },
      onEventTrigger,
      patientUuid,
      validate,
      validateForm,
      showNotification,
    } = this.props;
    const childProps = {
      collapse,
      enabled,
      formName,
      formVersion,
      validate,
      validateForm,
      onValueChanged: this.onChange,
      onControlAdd: this.onControlAdd,
      onControlRemove: this.onControlRemove,
      onEventTrigger,
      patientUuid,
      showNotification,
    };
    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const sectionClass =
      this.state.collapse ? 'closing-group-controls' : 'active-group-controls';
    const toggleClass = `form-builder-toggle ${classNames({ active: !this.state.collapse })}`;
    const disableClass = this.props.enabled ? '' : ' disabled';

    return (
        <fieldset className="form-builder-fieldset">
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
          <div className={`obsGroup-controls ${sectionClass}${disableClass}`} >
            {displayRowControls(groupedRowControls, this.props.children.toArray(), childProps)}
          </div>
        </fieldset>
    );
  }
}

Section.propTypes = {
  children: PropTypes.any,
  collapse: PropTypes.bool,
  enabled: PropTypes.bool,
  formName: PropTypes.string.isRequired,
  formVersion: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object,
    type: PropTypes.string.isRequired,
    controls: PropTypes.array,
  }),
  onEventTrigger: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
};

Section.defaultProps = {
  children: List.of([]),
  enabled: true,
};


ComponentStore.registerComponent('section', Section);

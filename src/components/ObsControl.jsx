import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Label } from 'components/Label.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import { Comment } from 'components/Comment.jsx';
import { getValidations } from 'src/helpers/controlsHelper';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';
import addMoreDecorator from './AddMoreDecorator';
import constants from 'src/constants';
import { Util } from 'src/helpers/Util';
import { injectIntl } from 'react-intl';

export class ObsControl extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    this.state = { };
    this.onChange = this.onChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
    this.onValueChangeDone = this.onValueChangeDone.bind(this);
    this.setAbnormal = this.setAbnormal.bind(this);
  }

  isAllowedToTriggerControlEvent(triggerControlEvent) {
    return triggerControlEvent === undefined || triggerControlEvent;
  }

  onValueChangeDone(triggerControlEvent) {
    if (this.props.onEventTrigger && this.isAllowedToTriggerControlEvent(triggerControlEvent)) {
      this.props.onEventTrigger(this.props.formFieldPath, 'onValueChange');
    }
  }

  onChange({ value, errors, calledOnMount, triggerControlEvent }) {
    const { metadata: { properties } } = this.props;

    const isAbnormalPropertyEnabled = find(properties, (val, key) => (key === 'abnormal' && val));
    const isAbnormal = find(errors, (err) => err.type === constants.errorTypes.warning
                                              && err.message === constants.validations.allowRange);
    let interpretation = isAbnormalPropertyEnabled && isAbnormal ? 'ABNORMAL' : null;
    if (calledOnMount) {
      interpretation = this.props.value.interpretation;
    }
    const obsValue = { value, comment: this.props.value.comment, interpretation };
    this.props.onValueChanged(
      this.props.formFieldPath,
      obsValue,
      errors,
       () => this.onValueChangeDone(triggerControlEvent));
  }

  onCommentChange(comment) {
    this.props.onValueChanged(
      this.props.formFieldPath,
      { value: this.props.value.value, comment, interpretation: this.props.value.interpretation },
      undefined
    );
  }

  displayObsControl(registeredComponent) {
    const { onControlAdd, hidden, enabled, metadata,
      metadata: { concept }, validate, validateForm, formFieldPath,
      showNotification, intl } = this.props;
    const options = metadata.options || concept.answers;
    const { conceptClass, conceptHandler } = concept;
    const validations = getValidations(metadata.properties, concept.properties);
    const isAddMoreEnabled =
      find(metadata.properties, (value, key) => (key === 'addMore' && value));
    return React.createElement(registeredComponent, {
      hidden,
      enabled,
      properties: metadata.properties,
      options,
      onChange: this.onChange,
      onControlAdd,
      onEventTrigger: this.onEventTrigger,
      validate,
      validateForm,
      formFieldPath,
      patientUuid: this.props.patientUuid,
      addMore: isAddMoreEnabled,
      validations,
      value: this.props.value.value,
      ...this._numericContext(metadata),
      showNotification,
      conceptClass,
      conceptHandler,
      intl,
    });
  }

  _numericContext(metadata) {
    return {
      hiNormal: metadata.hiNormal,
      lowNormal: metadata.lowNormal,
      hiAbsolute: metadata.hiAbsolute,
      lowAbsolute: metadata.lowAbsolute,
    };
  }

  _getUnits(units) {
    return units ? `(${units})` : '';
  }

  displayLabel() {
    const { enabled, intl, hidden, metadata: { properties, label, units } } = this.props;
    const { concept: { description } } = this.props.metadata;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    const labelMetadata = { ...label, units: this._getUnits(units) };
    const showHintButton = this.state && this.state.showHintButton;
    const labelComponent = (<Label enabled={enabled} hidden={hidden}
      intl={intl} metadata={labelMetadata}
    />);
    if (!hideLabel && description && description.value) {
      return (
              <div>
                  {labelComponent}
                  <i className="fa fa-question-circle form-builder-tooltip-trigger"
                    onClick={() => this.setState({ showHintButton: !showHintButton })}
                  />
              </div>
      );
    } else if (!hideLabel) {
      return (labelComponent);
    }
    return null;
  }

  markMandatory() {
    const { properties } = this.props.metadata;
    const isMandatory = find(properties, (value, key) => (key === 'mandatory' && value));
    if (isMandatory) {
      return <span className="form-builder-asterisk">*</span>;
    }
    return null;
  }

  showHelperText() {
    const { concept: { description } } = this.props.metadata;
    if (description && description.value) {
      const showHelperTextHtml = this.props.intl.formatHTMLMessage({
        defaultMessage: description.value,
        id: description.translationKey || 'defaultId',
      });
      return (
          <div className={classNames('form-builder-tooltip-wrap',
              { active: this.state.showHintButton === true })}>
          <p className="form-builder-tooltip-description">
            <i className="fa fa-caret-down"></i>
            <span className="details hint" dangerouslySetInnerHTML={{ __html: showHelperTextHtml }}>
            </span>
          </p>
        </div>
      );
    }
    return null;
  }

  showComment() {
    const { metadata: { properties } } = this.props;
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'notes' && value));
    if (isAddCommentsEnabled) {
      const comment = this.props.value.comment;
      const value = this.props.value.value;
      const { concept } = this.props.metadata;
      return (
        <Comment
          comment={comment} conceptHandler={concept.conceptHandler}
          datatype={concept.datatype} onCommentChange={this.onCommentChange}
          value={value}
        />
      );
    }
    return null;
  }

  isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  showAbnormalButton() {
    const { metadata: { properties }, value } = this.props;
    const isAbnormal = find(properties, (val, key) => (key === 'abnormal' && val));
    const isAbnormalObs = (value.interpretation === 'ABNORMAL');
    const abnormalClassName = classNames({ 'fa fa-ok': isAbnormalObs });
    if (isAbnormal) {
      return (
        <button className="abnormal-button" disabled={!value.value} onClick={this.setAbnormal} >
          <i className={abnormalClassName}></i>
            <span>Abnormal</span>
        </button>
      );
    }
    return null;
  }

  setAbnormal() {
    const { value } = this.props;
    if (value.value) {
      const interpretation = value.interpretation === 'ABNORMAL' ? null : 'ABNORMAL';
      this.props.onValueChanged(
        this.props.formFieldPath,
        { value: this.props.value.value, comment: this.props.value.comment, interpretation },
        undefined
      );
    }
  }

  render() {
    const { concept } = this.props.metadata;
    const registeredComponent = ComponentStore.getRegisteredComponent(concept.datatype);
    const complexClass = Util.isComplexMediaConcept(concept) ? 'complex-component' : '';
    const addMoreComplexClass = complexClass && this.isCreateByAddMore() ?
        'add-more-complex-component' : '';
    if (registeredComponent) {
      return (
          <div className={classNames('form-field-wrap clearfix', `${complexClass}`)}>
              {this.showHelperText()}
              <div className="form-field-content-wrap">
                  <div className={classNames('label-wrap fl', `${addMoreComplexClass}`)}>
                      {this.displayLabel()}
                      {this.markMandatory()}
                  </div>
                  <div className={classNames('obs-control-field')}>
                      {this.displayObsControl(registeredComponent)}
                      {this.showAbnormalButton()}
                      {this.showAddMore()}
                  </div>
              </div>
              {this.showComment()}
          </div>
      );
    }
    return (
        <div>
          <UnSupportedComponent
            message={ `The component with concept datatype ${concept.datatype} is not supported` }
          />
        </div>
    );
  }
}

ObsControl.propTypes = {
  children: PropTypes.array,
  collapse: PropTypes.bool,
  enabled: PropTypes.bool,
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
  }),
  onControlAdd: PropTypes.func,
  onControlRemove: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  showAddMore: PropTypes.bool.isRequired,
  showNotification: PropTypes.func.isRequired,
  showRemove: PropTypes.bool.isRequired,
  validate: PropTypes.bool.isRequired,
  validateForm: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
};

ObsControl.defaultProps = {
  enabled: true,
  hidden: false,
  showAddMore: false,
  showRemove: false,
};

const ObsControlWithIntl = injectIntl(ObsControl, { forwardRef: true });

export { ObsControlWithIntl };

ComponentStore.registerComponent('obsControl', ObsControl);

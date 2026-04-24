import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import addMoreDecorator from 'components/AddMoreDecorator';
import { getGroupedControls, displayRowControls } from 'src/helpers/controlsParser';
import { Accordion, AccordionItem } from '@bahmni/design-system';

export class Section extends addMoreDecorator(Component) {

  constructor(props) {
    super(props);
    const { collapse } = this.props;
    this.state = { errors: [], collapse };
    this.onChange = this.onChange.bind(this);
    this._onCollapse = this._onCollapse.bind(this);
    this.onControlAdd = this.onControlAdd.bind(this);
    this.onControlRemove = this.onControlRemove.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.collapse !== undefined &&
        (this.props.collapse !== prevProps.collapse ||
         (this.props.collapse !== prevState.collapse && prevProps.collapse === this.props.collapse))) {
      this.setState({ collapse: this.props.collapse });
    }
  }

  onChange(formFieldPath, value, errors, onActionDone) {
    this.props.onValueChanged(formFieldPath, value, errors, onActionDone);
  }

  onControlAdd(formFieldPath, isNotificationShown = true) {
    this.props.onControlAdd(formFieldPath, isNotificationShown);
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
      componentStore: this.props.componentStore,
    };

    const groupedRowControls = getGroupedControls(this.props.metadata.controls, 'row');
    const disableClass = enabled ? '' : ' disabled';

    const title = this.props.intl.formatMessage({
      defaultMessage: label.value,
      id: label.translationKey || 'defaultId',
    });

    return (
      <div className="form-builder-fieldset">
        {this.showAddMore()}
        <Accordion align="start">
          <AccordionItem
            open={!this.state.collapse}
            onHeadingClick={this._onCollapse}
            title={<strong className="test-section-label">{title}</strong>}
          >
            <IntlProvider {...this.props.intl}>
              <div className={`obsGroup-controls${disableClass}`}>
                {displayRowControls(groupedRowControls, this.props.children.toArray(), childProps)}
              </div>
            </IntlProvider>
          </AccordionItem>
        </Accordion>
      </div>
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
  children: List(),
  enabled: true,
};

export const SectionWithIntl = injectIntl(Section, { forwardRef: true });

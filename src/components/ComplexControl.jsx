import React from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';

export const ComplexControl = props => {
  const { conceptHandler } = props;
  const RegisteredComplexControl = ComponentStore.getRegisteredComponent(conceptHandler);

  return RegisteredComplexControl ? <RegisteredComplexControl {...props} /> : null;
};


ComplexControl.propTypes = {
  addMore: PropTypes.bool,
  conceptHandler: PropTypes.string.isRequired,
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onControlAdd: PropTypes.func.isRequired,
  patientUuid: PropTypes.string,
  properties: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

ComplexControl.defaultProps = {
  enabled: true,
  addMore: false,
};

ComponentStore.registerComponent('complex', ComplexControl);

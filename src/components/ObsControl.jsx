import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import { ObsMapper } from 'src/mapper/ObsMapper';
import { Comment } from 'components/Comment.jsx';
import { getValidations } from 'src/helpers/controlsHelper';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.mapper = new ObsMapper();
    this.state = { obs: props.obs };
    this.onChange = this.onChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.obs !== nextProps.obs) {
      this.setState({ obs: nextProps.obs });
    }
  }

  onChange(value, errors) {
    const updatedObs = this.mapper.setValue(this.state.obs, value);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs, errors);
  }

  onCommentChange(comment) {
    const updatedObs = this.mapper.setComment(this.state.obs, comment);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs);
  }

  displayObsControl(registeredComponent) {
    const { metadata, metadata: { concept }, validate } = this.props;
    const options = metadata.options || concept.answers;
    const validations = getValidations(metadata.properties, concept.properties);
    return React.createElement(registeredComponent, {
      properties: metadata.properties,
      options,
      onChange: this.onChange,
      validate,
      validations,
      value: this.mapper.getValue(this.state.obs),
      concept,
    });
  }

  displayLabel() {
    const { properties, label } = this.props.metadata;
    const hideLabel = find(properties, (value, key) => (key === 'hideLabel' && value));
    if (!hideLabel) {
      return (
            <Label metadata={label} />
      );
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

  showComment() {
    const { properties } = this.props.metadata;
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'notes' && value));
    if (isAddCommentsEnabled) {
      const comment = this.mapper.getComment(this.state.obs);
      return (
        <Comment comment={comment} onCommentChange={this.onCommentChange} />
      );
    }
    return null;
  }

  render() {
    const { concept } = this.props.metadata;
    const registeredComponent = ComponentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          <div className="label-wrap fl">
            {this.displayLabel()}
            {this.markMandatory()}
          </div>
          {this.displayObsControl(registeredComponent)}
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
  obs: PropTypes.any.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
};

ComponentStore.registerComponent('obsControl', ObsControl);

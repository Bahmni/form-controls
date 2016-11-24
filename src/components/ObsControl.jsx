import React, { Component, PropTypes } from 'react';
import { Label } from 'components/Label.jsx';
import 'src/helpers/componentStore';
import find from 'lodash/find';
import { ObsMapper } from 'src/helpers/ObsMapper';
import { Comment } from 'components/Comment.jsx';
import { getValidations } from 'src/helpers/controlsHelper';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.mapper = new ObsMapper(props.obs);
    this.state = { obs: props.obs };
    this.onChange = this.onChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
  }

  onChange(value, errors) {
    const updatedObs = this.mapper.setValue(value);
    this.props.onValueChanged(updatedObs, errors);
  }

  onCommentChange(comment) {
    const updatedObs = this.mapper.setComment(comment);
    this.props.onValueChanged(updatedObs);
  }

  displayObsControl(registeredComponent) {
    const { metadata } = this.props;
    const validations = getValidations(metadata.properties);
    return React.createElement(registeredComponent, {
      displayType: metadata.displayType,
      options: metadata.options,
      onChange: this.onChange,
      validations,
      value: this.mapper.getValue(),
    });
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
      const comment = this.mapper.getComment();
      return (
        <Comment comment={comment} onCommentChange={this.onCommentChange} />
      );
    }
    return null;
  }

  render() {
    const { concept, label } = this.props.metadata;
    const registeredComponent = window.componentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div>
          <div className="label-wrap fl">
            <Label metadata={label} />
            {this.markMandatory()}
          </div>
          {this.displayObsControl(registeredComponent)}
          {this.showComment()}
        </div>
      );
    }
    return null;
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
};

window.componentStore.registerComponent('obsControl', ObsControl);

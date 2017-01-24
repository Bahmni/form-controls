import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Label } from 'components/Label.jsx';
import ComponentStore from 'src/helpers/componentStore';
import find from 'lodash/find';
import { Comment } from 'components/Comment.jsx';
import { AddMore } from 'components/AddMore.jsx';
import { getValidations } from 'src/helpers/controlsHelper';
import { UnSupportedComponent } from 'components/UnSupportedComponent.jsx';
import isEmpty from 'lodash/isEmpty';

export class ObsControl extends Component {

  constructor(props) {
    super(props);
    this.state = { obs: props.obs };
    this.onChange = this.onChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onAddControl = this.onAddControl.bind(this);
    this.onRemoveControl = this.onRemoveControl.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.obs !== nextProps.obs) {
      this.setState({ obs: nextProps.obs });
    }
  }

  onChange(value, errors) {
    const updatedObs = this.props.mapper.setValue(this.state.obs, value);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs, errors);
  }

  onCommentChange(comment) {
    const updatedObs = this.props.mapper.setComment(this.state.obs, comment);
    this.setState({ obs: updatedObs });
    this.props.onValueChanged(updatedObs);
  }

  onAddControl() {
    this.props.onControlAdd(this.state.obs);
  }

  onRemoveControl() {
    this.props.onControlRemove(this.state.obs);
  }

  displayObsControl(registeredComponent) {
    const { mapper, metadata, metadata: { concept }, validate } = this.props;
    const options = metadata.options || concept.answers;
    const validations = getValidations(metadata.properties, concept.properties);
    return React.createElement(registeredComponent, {
      properties: metadata.properties,
      options,
      onChange: this.onChange,
      validate,
      validations,
      value: mapper.getValue(this.state.obs),
      ...this._numericContext(metadata),
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

  showHelperText() {
    const { concept } = this.props.metadata;
    const showHintButton = this.state && this.state.showHintButton;
    const description = concept.description && !isEmpty(concept.description) ?
      concept.description[0].display : undefined;
    if (description) {
      return (
        <div className={classNames('form-builder-tooltip-wrap fr',
           { active: showHintButton === true }) }>
          <i className="fa fa-question-circle form-builder-tooltip-trigger"
            onClick={() => this.setState({ showHintButton: !showHintButton })}
          />
          <p className="form-builder-tooltip-description">
            <i className="fa fa-caret-down"></i>
            <span className="details hint">{description}</span>
          </p>
        </div>
      );
    }
    return null;
  }

  showComment() {
    const { mapper, metadata: { properties } } = this.props;
    const isAddCommentsEnabled = find(properties, (value, key) => (key === 'notes' && value));
    if (isAddCommentsEnabled) {
      const comment = mapper.getComment(this.state.obs);
      return (
        <Comment comment={comment} onCommentChange={this.onCommentChange} />
      );
    }
    return null;
  }

  showAddMore() {
    const { metadata: { properties } } = this.props;
    const isAddMoreEnabled = find(properties, (value, key) => (key === 'addMore' && value));
    if (isAddMoreEnabled) {
      return (
              <AddMore canAdd={ this.props.showAddMore } canRemove={ this.props.showRemove }
                onAdd={this.onAddControl} onRemove={this.onRemoveControl}
              />
      );
    }
    return null;
  }

  render() {
    const { concept } = this.props.metadata;
    const registeredComponent = ComponentStore.getRegisteredComponent(concept.datatype);
    if (registeredComponent) {
      return (
        <div className="form-field-wrap clearfix">
          <div className="label-wrap fl">
            {this.displayLabel()}
            {this.markMandatory()}
            {this.showHelperText()}
          </div>
          {this.displayObsControl(registeredComponent)}
          {this.showAddMore()}
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
  mapper: PropTypes.object.isRequired,
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
  onControlAdd: PropTypes.func,
  onControlRemove: PropTypes.func,
  onValueChanged: PropTypes.func.isRequired,
  showAddMore: PropTypes.bool.isRequired,
  showRemove: PropTypes.bool.isRequired,
  validate: PropTypes.bool.isRequired,
};

ObsControl.defaultProps = {
  showAddMore: false,
  showRemove: false,
};

ComponentStore.registerComponent('obsControl', ObsControl);

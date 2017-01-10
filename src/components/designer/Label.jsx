import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';

export class LabelDesigner extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      defaultValue: props.metadata.value,
      value: props.metadata.value,
    };
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onEnterKey = this.onEnterKey.bind(this);
    this.storeComponentRef = this.storeComponentRef.bind(this);
    this.getJsonDefinition = this.getJsonDefinition.bind(this);
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
      this.input.select();
    }
  }

  onDoubleClick() {
    this.setState({ isEditable: true });
  }

  onBlur() {
    this.updateValue();
  }

  onEnterKey(e) {
    if (e.keyCode === 13) {
      this.updateValue();
    }
  }

  getJsonDefinition() {
    const value = this.state.value;
    return Object.assign({}, this.props.metadata, { value });
  }

  updateValue() {
    const updatedValue = (this.input && this.input.value) ? this.input.value.trim() : undefined;
    const value = updatedValue || this.state.value;
    this.setState({
      isEditable: false,
      value,
    });
  }

  storeComponentRef(ref) {
    if (ref !== null) this.input = ref;
  }

  render() {
    if (this.state.isEditable) {
      return (
        <input
          defaultValue={this.state.value}
          onBlur={this.onBlur}
          onKeyUp={this.onEnterKey}
          ref={this.storeComponentRef}
          type="text"
        />
      );
    }
    return (
      <label
        onDoubleClick={this.onDoubleClick}
      >
        { this.state.value }
      </label>);
  }
}

LabelDesigner.injectConceptToMetadata = metadata => metadata;

LabelDesigner.propTypes = {
  metadata: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
  }),
};

const descriptor = {
  control: LabelDesigner,
  designProperties: {
    isTopLevelComponent: true,
    displayName: 'Label',
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'label',
      },
      {
        name: 'value',
        dataType: 'text',
        defaultValue: 'Label',
      },
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('label', descriptor);

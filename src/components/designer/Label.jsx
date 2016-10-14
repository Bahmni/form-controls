import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

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
    return {
      type: 'label',
      value: this.state.value,
    };
  }

  updateMetadata(value) {
    const newMetadata = Object.assign({}, this.props.metadata, { value });
    this.props.onUpdateMetadata(newMetadata);
  }

  updateValue() {
    const value = (this.input && this.input.value) ? this.input.value : this.state.value;
    this.updateMetadata(value);
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
          defaultValue={ this.state.value }
          onBlur={this.onBlur}
          onKeyUp={this.onEnterKey}
          ref={ this.storeComponentRef }
          type="text"
        />
      );
    }
    return (<span onDoubleClick={ this.onDoubleClick }>{ this.state.value }</span>);
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
  onUpdateMetadata: PropTypes.func.isRequired,
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
        attributes: [
          {
            name: 'location',
            dataType: 'complex',
            attributes: [
              {
                name: 'row',
                dataType: 'number',
              },
              {
                name: 'column',
                dataType: 'number',
              },
            ],
          },
        ],
      },
    ],
  },
};

window.componentStore.registerDesignerComponent('label', descriptor);

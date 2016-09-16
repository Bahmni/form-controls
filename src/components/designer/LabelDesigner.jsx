import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class LabelDesigner extends Component {
  constructor(props) {
    super(props);
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

  updateValue() {
    this.setState({
      isEditable: false,
      value: (this.input && this.input.value) ? this.input.value : this.state.value,
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

LabelDesigner.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

const descriptor = {
  control: LabelDesigner,
  designProperties: {
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
    ],
  },
};

window.componentStore.registerDesignerComponent('label', descriptor);

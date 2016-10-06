import React, { PropTypes } from 'react';
import Draggable from 'components/Draggable.jsx';
import 'src/helpers/componentStore';

export class LabelDesigner extends Draggable {
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
    this.processDragStart = this.processDragStart.bind(this);
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
      id: this.props.metadata.id,
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
    const context = {
      type: this.props.metadata.type,
      data: Object.assign({}, this.props.metadata, { value: this.state.value }),
    };

    return (
      <span
        draggable="true"
        onDoubleClick={ this.onDoubleClick }
        onDragEnd={ this.onDragEnd(context) }
        onDragStart={ this.onDragStart(context) }
      >{ this.state.value }</span>);
  }
}

LabelDesigner.propTypes = {
  metadata: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
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
    ],
  },
};

window.componentStore.registerDesignerComponent('label', descriptor);

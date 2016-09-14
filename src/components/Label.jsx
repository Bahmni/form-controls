import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';

export class Label extends Component{
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.metadata.value,
      value: props.metadata.value,
      isEditable: false,
    };
    const properties = props.metadata.properties;
    this.isDesignMode = properties ? properties.isDesignMode : true;
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onEnterKey = this.onEnterKey.bind(this);
    this.storeComponentRef = this.storeComponentRef.bind(this);
  }

  onDoubleClick() {
    if(this.isDesignMode){
      return () => {
        this.setState({ isEditable: true });
      }
    }
    return undefined;
  }

  onBlur() {
    if(this.isDesignMode) {
      return () => {
        this.setState({
          isEditable: false,
          value: (this.input && this.input.value) ? this.input.value : this.state.value,
        });
      }
    }
  }

  onEnterKey() {
    if(this.isDesignMode) {
      return (e) => {
        if(e.keyCode === 13) {
          this.setState({
            isEditable: false,
            value: (this.input && this.input.value) ? this.input.value : this.state.value,
          });
        }
      }
    }
  }

  componentDidUpdate() {
    if(this.input) {
      this.input.focus();
      this.input.select();
    }
  }

  storeComponentRef(ref) {
    if (ref != null) this.input = ref;
  }

  render() {
    if(this.state.isEditable){
      return (
      <input
        defaultValue={ this.state.value }
        onBlur={this.onBlur()}
        onKeyUp={this.onEnterKey()}
        ref={ this.storeComponentRef }
        type="text"
      />
      );
    }
    return(<span onDoubleClick={ this.onDoubleClick() }>{ this.state.value }</span>);
  }
};

Label.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      isDesignMode: PropTypes.boolean,
    }),
  }),
};

const descriptor = {
  control: Label,
  designProperties: {
    displayName: 'Label',
    isTopLevelComponent: true,
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
            name: 'mandatory',
            dataType: 'boolean'
          },
          {
            name: 'isDesignMode',
            dataType: 'boolean',
            defaultValue: false,
          }
        ],
      }
    ],
  }
};

window.componentStore.registerComponent('label', descriptor);

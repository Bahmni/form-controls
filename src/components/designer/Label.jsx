import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import TranslationKeyGenerator from 'src/services/TranslationKeyService';

export class LabelDesigner extends Component {
  constructor(props) {
    super(props);
    const { metadata, metadata: { id, value } } = props;
    const translationKey = metadata.translation_key ||
      (new TranslationKeyGenerator(value, id)).build();
    this.state = { value, translation_key: translationKey };
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.showDeleteButton = this.showDeleteButton.bind(this);
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
    const translationKey = this.state.translation_key;
    return Object.assign({}, { translation_key: translationKey }, this.props.metadata, { value });
  }

  updateValue() {
    const updatedValue = (this.input && this.input.value) ? this.input.value.trim() : undefined;
    const value = updatedValue || this.state.value;
    this.setState({
      isEditable: false,
      value,
    });
  }

  _getLabelValue() {
    const { value } = this.state;
    const { units } = this.props.metadata;
    return units ? `${value} ${units}` : value;
  }

  storeComponentRef(ref) {
    if (ref !== null) this.input = ref;
  }

  showDeleteButton() {
    if (this.props.deleteControl && this.props.showDeleteButton) {
      return (
        <button className="remove-control-button" onClick={this.props.deleteControl}>
          <i aria-hidden="true" className="fa fa-trash"></i>
        </button>
      );
    }
    return null;
  }

  stopEventPropagation(event) {
    if (this.props.dispatch) {
      this.props.dispatch();
      event.stopPropagation();
    }
  }

  render() {
    if (this.state.isEditable) {
      return (
          <input
            className="form-builder-label" defaultValue={ this.state.value }
            onBlur={this.onBlur} onKeyUp={this.onEnterKey}
            ref={ this.storeComponentRef }
            type="text"
          />
      );
    }
    return (
      <div className="control-wrapper-content" onClick={(e) => this.stopEventPropagation(e) }>
        <label
          onDoubleClick={ this.onDoubleClick }
        >
          { this._getLabelValue() }
        </label>
        {this.showDeleteButton()}
      </div>);
  }
}

LabelDesigner.injectConceptToMetadata = metadata => metadata;

LabelDesigner.propTypes = {
  clearSelectedControl: PropTypes.func,
  deleteControl: PropTypes.func,
  dispatch: PropTypes.func,
  metadata: PropTypes.shape({
    id: PropTypes.string,
    translation_key: PropTypes.string,
    type: PropTypes.string.isRequired,
    units: PropTypes.string,
    value: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
  }),
  showDeleteButton: PropTypes.bool.isRequired,
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

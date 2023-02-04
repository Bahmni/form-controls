import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { SectionMapper } from '../../mapper/SectionMapper';
import { LabelDesigner } from 'components/designer/Label.jsx';

export class LinkDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new SectionMapper();
    this.storeNameLabelRef = this.storeNameLabelRef.bind(this);
    this.storeUrlLabelRef = this.storeUrlLabelRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
  }

   getJsonDefinition() {
    const namelabelJsonDefinition = this.nameLabelControl && this.nameLabelControl.getJsonDefinition();
    const urllabelJsonDefinition = this.urlLabelControl && this.urlLabelControl.getJsonDefinition();

    return Object.assign({}, this.props.metadata, {}, { label: namelabelJsonDefinition, link: urllabelJsonDefinition });
  }

  storeNameLabelRef(ref) {
    this.nameLabelControl = ref;
  }

  storeUrlLabelRef(ref) {
    this.urlLabelControl = ref;
  }

  displayNameLabel() {
    const { metadata: { label, id } } = this.props;
    const data = Object.assign({}, label, { id });
    return (
      <LabelDesigner
        metadata={ data }
        ref={ this.storeNameLabelRef }
        showDeleteButton={ false }
      />
    );
  }

  displayUrlLabel() {
    const { metadata: { link, id } } = this.props;
    const data = Object.assign({}, link, { id });
    return (
      <LabelDesigner
        metadata={ data }
        ref={ this.storeUrlLabelRef }
        showDeleteButton={ false }
      />
    );
  }

  deleteControl(event) {
    this.props.deleteControl();
    this.props.clearSelectedControl(event);
  }

  showDeleteButton() {
    if (this.props.showDeleteButton) {
      return (
        <button className="remove-control-button" onClick={this.deleteControl}>
          <i aria-hidden="true" className="fa fa-trash"></i>
        </button>
      );
    }
    return null;
  }

  stopEventPropagation(event) {
    this.props.dispatch();
    event.stopPropagation();
  }

  render() {
    const { metadata } = this.props;
    return (
        <div
          className="control-wrapper-content"
          onClick={(event) => {
            this.stopEventPropagation(event);
            this.props.onSelect(event, metadata);
          }}
        >
          {this.showDeleteButton()}
          <table class="link">
            <tr>
              <td><strong>Display Name:</strong></td>
              <td>{this.displayNameLabel()}</td>
            </tr>
            <tr>
              <td><strong>Url:</strong></td>
              <td>{this.displayUrlLabel()}</td>
            </tr>
          </table>
        </div>
    );
  }
}

LinkDesigner.propTypes = {
  clearSelectedControl: PropTypes.func.isRequired,
  deleteControl: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  metadata: PropTypes.shape({
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.object,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool,
};

const descriptor = {
  control: LinkDesigner,
  designProperties: {
    displayName: 'Link',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'link',
      },
      {
        name: 'value',
        dataType: 'text',
        defaultValue: 'link',
      },
      {
        name: 'label',
        dataType: 'complex',
        attributes: [
          {
            name: 'type',
            dataType: 'text',
            defaultValue: 'label',
          },
          {
            name: 'value',
            dataType: 'text',
            defaultValue: 'name',
          },
        ],
      },
      {
        name: 'link',
        dataType: 'complex',
        attributes: [
          {
            name: 'type',
            dataType: 'text',
            defaultValue: 'label',
          },
          {
            name: 'value',
            dataType: 'text',
            defaultValue: 'url',
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('link', descriptor);

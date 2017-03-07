import React from 'react';
import find from 'lodash/find';
import { AddMore } from 'components/AddMore.jsx';

const addMoreDecorator = Sup => class extends Sup {
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

  onAddControl() {
    this.props.onControlAdd(this.props.formFieldPath);
  }

  onRemoveControl() {
    this.props.onControlRemove(this.props.formFieldPath);
  }

  updateGroupMembers(obsGroupMembers, nextFormFieldPath) {
    if (obsGroupMembers) {
      const suffix = nextFormFieldPath.split('-')[1];
      return obsGroupMembers.map(nextObs => {
        const nextPath = `${nextObs.formFieldPath.split('-')[0]}-${suffix}`;
        const updatedObs = nextObs
          .set('formFieldPath', nextPath)
          .set('uuid', undefined).void();
        return updatedObs.set('groupMembers',
          this.updateGroupMembers(updatedObs.groupMembers, nextFormFieldPath));
      });
    }
    return null;
  }
};

export default addMoreDecorator;

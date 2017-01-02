import React, { PureComponent, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { AutoComplete } from 'src/components/AutoComplete.jsx';

export class DropDown extends PureComponent {

  render() {
    return (
        <AutoComplete {...this.props}
          asynchronous={false}
          minimumInput={0}
          searchable={this.props.searchable}
        />
    );
  }
}

DropDown.propTypes = {
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  labelKey: PropTypes.string,
  onValueChange: PropTypes.func,
  options: PropTypes.array,
  searchable: PropTypes.bool,
  validations: PropTypes.array,
  value: PropTypes.any,
  valueKey: PropTypes.string,
};

DropDown.defaultProps = {
  autofocus: false,
  disabled: false,
  labelKey: 'display',
  valueKey: 'uuid',
  searchable: false,
};

const descriptor = {
  control: DropDown,
  designProperties: {
    isTopLevelComponent: false,
  },
  metadata: {
    attributes: [
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [],
      },
    ],
  },
};


ComponentStore.registerDesignerComponent('dropDown', descriptor);

ComponentStore.registerComponent('dropDown', DropDown);


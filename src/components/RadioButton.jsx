import React, { Component, PropTypes } from 'react';
import 'src/helpers/componentStore';
import map from 'lodash/map';

export class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.changeValue = this.changeValue.bind(this);
  }

  getValue() {
    return this.state.value;
  }

  changeValue(value) {
    this.setState({ value });
  }

  displayRadioButtons() {
    return map(this.props.options, (option, index) =>
     <div key={index} onClick={() => this.changeValue(option.value)}>
       <input
         checked={this.state.value === option.value}
         key={index}
         name={this.props.id}
         type="radio"
         value={option.value}
       />
       {option.name}
     </div>
    );
  }

  render() {
    return <div>{this.displayRadioButtons()}</div>;
  }
}

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array,
  value: PropTypes.any,
};

RadioButton.defaultProps = {
  options: [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ],
};

window.componentStore.registerComponent('radio', RadioButton);

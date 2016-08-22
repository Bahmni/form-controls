import React, {PropTypes, Component} from 'react';

export class FormControlsContainer extends Component {
  constructor(props) {
    super(props);
  }

  getControls() {
    return this.props.metadata.controls.map((control) => {
      const component = componentStore.getRegisteredComponent(control.type);
      if (component) {
        return React.createElement(component, { key: control.id, metadata: control });
      }
    }).filter(element => element !== undefined);
  }


  render() {
    return (
      <div>{this.getControls()}</div>
    );
  }
}

FormControlsContainer.propTypes = {
  metadata: PropTypes.object.isRequired,
  obs: PropTypes.array.isRequired,
};

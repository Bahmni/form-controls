import React, { Component, PropTypes } from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Row from 'components/Row.jsx';
import sinon from 'sinon';
import 'src/helpers/componentStore';

chai.use(chaiEnzyme());

function getLocationProperties(row, column) {
  return { location: { row, column } };
}

class DummyControl extends Component {
  getValue() {
    return this.props.formUuid;
  }

  render() {
    return (<div>{ this.props.formUuid }</div>);
  }
}

DummyControl.propTypes = {
  formUuid: PropTypes.string,
};

describe('Row', () => {
  const controls = [
    {
      id: '100',
      type: 'randomType',
      value: 'Pulse',
      properties: getLocationProperties(0, 1),
    },
    {
      id: '101',
      type: 'randomType',
      properties: getLocationProperties(0, 2),
    },
    {
      id: '102',
      type: 'randomType',
      properties: getLocationProperties(0, 3),
    },
  ];

  const formUuid = 'someUuid';

  before(() => {
    window.componentStore.componentList = {};
    window.componentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('randomType');
  });

  const onChangeSpy = sinon.spy();

  describe('render', () => {
    it('should render rows', () => {
      const wrapper = mount(
        <Row
          controls={controls}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />
      );

      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('.form-builder-column-1').text()).to.eql(formUuid);
      expect(wrapper.find('DummyControl').at(0)).to.have.prop('validate').to.eql(false);
    });

    it('should not render rows when controls is empty', () => {
      const wrapper = shallow(
        <Row
          controls={[]}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />
      );

      expect(wrapper).to.be.blank();
    });
  });
});

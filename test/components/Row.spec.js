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
      const error = [{ errorType: 'someErrorType' }];
      const wrapper = mount(
        <Row
          controls={controls}
          errors={error}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
        />
      );

      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('.form-builder-column-1').text()).to.eql(formUuid);
      expect(wrapper.find('DummyControl').at(0).props().errors).to.eql(error);
    });

    it('should not render rows when controls is empty', () => {
      const wrapper = shallow(
        <Row
          controls={[]}
          errors={[]}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
        />
      );

      expect(wrapper).to.be.blank();
    });
  });

  describe('getValue', () => {
    it('should return the observations of its child controls', () => {
      const wrapper = mount(
        <Row
          controls={controls}
          errors={[]}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
        />
      );
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([formUuid, formUuid, formUuid]);
    });

    it('should return empty when there are no controls', () => {
      const wrapper = mount(
        <Row
          controls={[]}
          errors={[]}
          formUuid={formUuid}
          id={0}
          observations={[]}
          onValueChanged={onChangeSpy}
        />
      );
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });
  });
  describe('getErrors', () => {
    it('should return errors of its child controls', () => {
      const wrapper = shallow(
          <Row
            controls={controls}
            errors={[]}
            formUuid={formUuid}
            id={0}
            observations={[]}
            onValueChanged={onChangeSpy}
          />
      );
      const instance = wrapper.instance();

      const error1 = { errorType: 'error1' };
      const error2 = { errorType: 'error2' };
      const error3 = { errorType: 'error3' };
      instance.childControls = {
        ref1: { getErrors: () => [error1, error2] },
        ref2: { getErrors: () => [error3, error1, error2] },
      };

      expect(instance.getErrors()).to.deep.equal([error1, error2, error3, error1, error2]);
    });
  });
});

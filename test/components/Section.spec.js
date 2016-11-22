import React, { Component, PropTypes } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Section } from 'components/Section.jsx';

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

describe.skip('Section', () => {
  before(() => {
    window.componentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    window.componentStore.deRegisterComponent('randomType');
  });

  const formUuid = 'someUuid';

  const metadata = {
    id: '1',
    type: 'section',
    value: 'Section Title',
    properties: {
      location: getLocationProperties(0, 0).location,
      visualOnly: true,
    },
    controls: [
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
        properties: getLocationProperties(1, 0),
      },
    ],
  };

  describe('render', () => {
    it('should render section', () => {
      const errors = [{ errorType: 'someErrorType' }];
      const wrapper = mount(
        <Section
          errors={errors}
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
        />);

      expect(wrapper.find('legend').text()).to.eql('Section Title');
      expect(wrapper).to.have.exactly(2).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('Row').at(0).props().observations).to.eql([]);
      expect(wrapper.find('DummyControl').at(0).props().errors).to.eql(errors);
    });

    it('should render section control with observations', () => {
      const observations = [
        {
          formNamespace: `${formUuid}/101`,
          value: 'someValue',
        },
        {
          formNamespace: `${formUuid}/102`,
          value: 'someValue',
        },
      ];
      const wrapper = mount(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadata}
          obs={observations}
        />);

      expect(wrapper.find('Row').at(0).props().observations).to.deep.eql(observations);
      expect(wrapper.find('legend').text()).to.eql('Section Title');
    });

    it('should render section without controls when it is empty', () => {
      const metadataClone = Object.assign({}, metadata);
      metadataClone.controls = [];
      const wrapper = shallow(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadataClone}
          obs={[]}
        />);

      expect(wrapper.find('legend').text()).to.eql('Section Title');
      expect(wrapper.find('.section-controls')).to.be.blank();
    });

    it('should render section with only the registered controls', () => {
      window.componentStore.deRegisterComponent('randomType');
      const wrapper = shallow(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
        />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      window.componentStore.registerComponent('randomType', DummyControl);
    });
  });

  describe('getValue', () => {
    it('should return the observations from child Controls', () => {
      const wrapper = mount(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
        />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([formUuid, formUuid, formUuid]);
    });

    it('should return empty when there are no observations', () => {
      const metadataClone = Object.assign({}, metadata);
      metadataClone.controls = [];
      const wrapper = mount(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadataClone}
          obs={[]}
        />);
      const instance = wrapper.instance();

      expect(instance.getValue()).to.deep.equal([]);
    });
  });

  describe('getError', () => {
    it('should return errors from child controls', () => {
      const wrapper = mount(
        <Section
          errors={[]}
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
        />);
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

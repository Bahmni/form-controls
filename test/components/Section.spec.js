import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Section } from 'components/Section.jsx';
import sinon from 'sinon';
import ComponentStore from 'src/helpers/componentStore';

chai.use(chaiEnzyme());

function getLocationProperties(row, column) {
  return { location: { row, column } };
}

const DummyControl = () => <input />;

let onChangeSpy;

beforeEach(() => {
  onChangeSpy = sinon.spy();
});

describe('Section', () => {
  before(() => {
    ComponentStore.registerComponent('randomType', DummyControl);
  });

  after(() => {
    ComponentStore.deRegisterComponent('randomType');
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
      const wrapper = mount(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').text()).to.eql('Section Title');
      expect(wrapper).to.have.exactly(2).descendants('Row');
      expect(wrapper).to.have.exactly(3).descendants('DummyControl');
      expect(wrapper.find('Row').at(0).props().observations).to.eql([]);
      expect(wrapper.find('DummyControl').at(0).props().validate).to.eql(false);
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
          formUuid={formUuid}
          metadata={metadata}
          obs={observations}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('Row').at(0).props().observations).to.deep.eql(observations);
      expect(wrapper.find('legend').text()).to.eql('Section Title');
    });

    it('should render section without controls when it is empty', () => {
      const metadataClone = Object.assign({}, metadata);
      metadataClone.controls = [];
      const wrapper = shallow(
        <Section
          formUuid={formUuid}
          metadata={metadataClone}
          obs={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper.find('legend').text()).to.eql('Section Title');
      expect(wrapper.find('.section-controls')).to.be.blank();
    });

    it('should render section with only the registered controls', () => {
      ComponentStore.deRegisterComponent('randomType');
      const wrapper = shallow(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      expect(wrapper).to.not.have.descendants('DummyControl');
      ComponentStore.registerComponent('randomType', DummyControl);
    });

    it('should callback on value change in any of child controls', () => {
      const wrapper = mount(
        <Section
          formUuid={formUuid}
          metadata={metadata}
          obs={[]}
          onValueChanged={onChangeSpy}
          validate={false}
        />);

      const onValueChange = wrapper.find('DummyControl').at(0).props().onValueChanged;
      onValueChange();
      sinon.assert.calledOnce(onChangeSpy);
    });
  });
});

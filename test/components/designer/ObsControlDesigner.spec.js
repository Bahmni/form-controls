import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControlDesigner } from 'components/designer/ObsControlDesigner.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

const concept = { name: 'dummyPulse', datatype: 'text', uuid: 'dummyUuid' };
const properties = {};
class DummyControl extends Component {
  getJsonDefinition() {
    return { concept, properties };
  }

  render() {
    return <input />;
  }
}

describe('ObsControlDesigner', () => {
  let wrapper;
  let metadata;
  let onSelectSpy;

  context('when concept is not present', () => {
    beforeEach(() => {
      onSelectSpy = sinon.spy();
      metadata = { id: '123', type: 'obsControl', properties };
      wrapper = shallow(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
    });

    it('should render simple div when there is no concept', () => {
      expect(wrapper.find('div').text()).to.eql('Select Obs Source');
    });

    it('should call onSelect function passed as prop', () => {
      expect(wrapper.find('div')).to.have.prop('onClick');
      wrapper.find('div').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, '123');
    });
  });

  context('when concept is present', () => {
    const label = {
      type: 'label',
      value: concept.name,
    };
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        label,
        properties,
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
      wrapper = mount(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
    });

    after(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should render label and obsControl of appropriate displayType', () => {
      expect(wrapper).to.have.descendants('LabelDesigner');
      expect(wrapper).to.have.descendants('input');
    });

    it('should pass appropriate props to Label', () => {
      const expectedLabelMetadata = { type: 'label', value: 'dummyPulse' };
      expect(wrapper.find('LabelDesigner').props().metadata).to.deep.eql(expectedLabelMetadata);
    });

    it('should not render obsControl if there is no registered designer component', () => {
      const conceptClone = Object.assign({}, concept);
      conceptClone.datatype = 'somethingRandom';
      const metadataClone = Object.assign({}, metadata);
      metadataClone.concept = conceptClone;
      wrapper = mount(<ObsControlDesigner metadata={metadataClone} onSelect={onSelectSpy} />);
      expect(wrapper).to.be.blank();
    });

    it('should call onSelect function passed as prop', () => {
      expect(wrapper.find('div')).to.have.prop('onClick');
      wrapper.find('input').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, sinon.match.any, '123');
    });

    it('should return json definition', () => {
      const expectedLabelMetadata = { type: 'label', value: 'dummyPulse' };
      const instance = wrapper.instance();
      const expectedJson = { concept, label: expectedLabelMetadata, properties: {} };
      expect(instance.getJsonDefinition()).to.eql(expectedJson);
    });
  });
});

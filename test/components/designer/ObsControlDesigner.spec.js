import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ObsControlDesigner } from 'components/designer/ObsControlDesigner.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

const concept = { name: 'Pulse', uuid: 'someUuid' };
class DummyControl extends Component {
  getJsonDefinition() {
    return concept;
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
      metadata = { id: '123', type: 'obsControl' };
      wrapper = shallow(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
    });

    it('should render simple div when there is no concept', () => {
      expect(wrapper.find('div').text()).to.eql('Select Obs Source');
    });

    it('should call onSelect function passed as prop', () => {
      expect(wrapper.find('div')).to.have.prop('onClick');
      wrapper.find('div').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, '123');
    });
  });

  context('when concept is present', () => {
    beforeEach(() => {
      metadata = {
        id: '123',
        type: 'obsControl',
        concept,
        displayType: 'text',
      };

      const textBoxDescriptor = { control: DummyControl };
      componentStore.registerDesignerComponent('text', textBoxDescriptor); // eslint-disable-line no-undef
      onSelectSpy = sinon.spy();
    });

    after(() => {
      componentStore.deRegisterDesignerComponent('text'); // eslint-disable-line no-undef
    });

    it('should render obsControl of appropriate displayType', () => {
      wrapper = mount(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
      expect(wrapper).to.have.descendants('input');
    });

    it('should not render obsControl if there is no registered designer component', () => {
      metadata.displayType = 'somethingRandom';
      wrapper = mount(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
      expect(wrapper).to.be.blank();
    });

    it('should call onSelect function passed as prop', () => {
      wrapper = mount(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);
      expect(wrapper.find('div')).to.have.prop('onClick');
      wrapper.find('input').simulate('click');
      sinon.assert.calledOnce(onSelectSpy);
      sinon.assert.calledWith(onSelectSpy, '123');
    });

    it('should return json definition', () => {
      wrapper = mount(<ObsControlDesigner metadata={metadata} onSelect={onSelectSpy} />);

      const instance = wrapper.instance();
      expect(instance.getJsonDefinition()).to.eql(concept);
    });
  });
});

import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { AddMore } from '../../src/components/AddMore.jsx';

chai.use(chaiEnzyme());

describe('AddMore', () => {
  it('should render both add and remove buttons with proper call backs', () => {
    const onAddSpy = sinon.spy();
    const onRemoveSpy = sinon.spy();
    const wrapper = mount(<AddMore
      canAdd canRemove
      onAdd={onAddSpy} onRemove={onRemoveSpy}
    />);

    expect(wrapper.find('button').at(0).text()).to.be.eql('+');
    expect(wrapper.find('button').at(0).props().onClick).to.be.eql(onAddSpy);
    expect(wrapper.find('button').at(1).text()).to.be.eql('-');
    expect(wrapper.find('button').at(1).props().onClick).to.be.eql(onRemoveSpy);
  });

  it('should not render add button when canAdd is false', () => {
    const onAddSpy = sinon.spy();
    const onRemoveSpy = sinon.spy();
    const wrapper = mount(<AddMore
      canAdd={false}
      canRemove onAdd={onAddSpy} onRemove={onRemoveSpy}
    />);

    expect(wrapper.find('button').text()).to.be.eql('-');
    expect(wrapper.find('button').props().onClick).to.be.eql(onRemoveSpy);
  });

  it('should not render remove button when canRemove is false', () => {
    const onAddSpy = sinon.spy();
    const onRemoveSpy = sinon.spy();
    const wrapper = mount(<AddMore
      canAdd canRemove={false}
      onAdd={onAddSpy} onRemove={onRemoveSpy}
    />);

    expect(wrapper.find('button').text()).to.be.eql('+');
    expect(wrapper.find('button').props().onClick).to.be.eql(onAddSpy);
  });

  it('should call correct callbacks on button clicks', () => {
    const onAddSpy = sinon.spy();
    const onRemoveSpy = sinon.spy();
    const wrapper = mount(<AddMore
      canAdd canRemove
      onAdd={onAddSpy} onRemove={onRemoveSpy}
    />);

    wrapper.find('button').at(0).simulate('click');
    sinon.assert.calledOnce(onAddSpy);

    wrapper.find('button').at(1).simulate('click');
    sinon.assert.calledOnce(onRemoveSpy);
  });
});

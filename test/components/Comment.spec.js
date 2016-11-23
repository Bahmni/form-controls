import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Comment } from 'components/Comment.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Comment', () => {
  let wrapper;
  const onCommentChange = sinon.spy();

  beforeEach(() => {
    wrapper = shallow(<Comment onCommentChange={onCommentChange} />);
  });

  it('should render add comment button', () => {
    expect(wrapper).to.have.descendants('button');
    expect(wrapper).to.not.have.descendants('textarea');
  });

  it('should render the comment section on click of button', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper).to.have.descendants('button');
    expect(wrapper).to.have.descendants('textarea');
  });

  it('should hide the comment section on click of button if it is shown', () => {
    wrapper.find('button').simulate('click');
    expect(wrapper).to.have.descendants('textarea');

    wrapper.find('button').simulate('click');
    expect(wrapper).to.not.have.descendants('textarea');
  });

  it('should set comment', () => {
    wrapper.find('button').simulate('click');
    wrapper.find('textarea').simulate('change', { target: { value: 'New Comment' } });
    sinon.assert.calledOnce(onCommentChange.withArgs('New Comment'));
  });

  it('should set comment with undefined if filled with empty spaces', () => {
    wrapper.find('button').simulate('click');
    wrapper.find('textarea').simulate('change', { target: { value: '   ' } });
    sinon.assert.calledOnce(onCommentChange.withArgs(undefined));
  });

  it('should render comment section with default value', () => {
    wrapper = shallow(<Comment comment={'Some Comment'} onCommentChange={onCommentChange} />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('textarea').props().defaultValue).to.be.eql('Some Comment');
  });
});


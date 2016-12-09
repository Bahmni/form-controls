import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { Draggable } from 'src/components/Draggable.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Draggable', () => {
  const context = {
    type: 'controlType',
    data: { value: 'contextValue' },
  };
  const eventData = {
    stopPropagation() {},
    dataTransfer: {
      setData: (type, data) => ({ type, data }),
    },
  };

  before(() => {
    sinon.stub(eventData.dataTransfer, 'setData');
  });

  after(() => {
    eventData.dataTransfer.setData.restore();
  });

  it('should set the context for drag start', () => {
    const draggable = new Draggable();
    const dragStartCb = draggable.onDragStart(context);

    dragStartCb(eventData);

    sinon.assert.calledWith(eventData.dataTransfer.setData, 'data', JSON.stringify(context));
  });

  it('should call process drag start', () => {
    const draggable = new Draggable();
    sinon.stub(draggable, 'processDragStart');
    const dragStartCb = draggable.onDragStart(context);

    dragStartCb(eventData);

    sinon.assert.calledWith(draggable.processDragStart, context);
    draggable.processDragStart.restore();
  });

  it('should notify parent about the drag move if parent ref present', () => {
    const parentData = {
      parentRef: {
        notifyMove: (e, c) => ({ e, c }),
      },
    };
    const draggable = new Draggable(parentData);
    const dragEndCb = draggable.onDragEnd(context);
    sinon.spy(parentData.parentRef, 'notifyMove');

    dragEndCb(eventData);

    sinon.assert.calledWith(parentData.parentRef.notifyMove, eventData, context);
    parentData.parentRef.notifyMove.restore();
  });
});

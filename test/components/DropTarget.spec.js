import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { DropTarget } from 'src/components/DropTarget.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('DropTarget', () => {
  let eventData;
  const testContext = { type: 'testType', data: { id: '123' } };
  beforeEach(() => {
    eventData = {
      preventDefault: () => {
      },
      dataTransfer: {
        getData: () => JSON.stringify(testContext),
      },
    };
  });

  afterEach(() => {
    eventData = undefined;
  });

  it('should make a subclass a valid drop target', () => {
    const dropTarget = new DropTarget();
    const eventExpectation = sinon.mock(eventData).expects('preventDefault');
    eventExpectation.twice();

    dropTarget.onDragOver(eventData);
    dropTarget.onDrop(eventData);

    eventExpectation.verify();
    eventData.preventDefault.restore();
  });

  it('should call processDrop when drop happens', () => {
    const dropTarget = new DropTarget();
    sinon.spy(dropTarget, 'processDrop');

    dropTarget.onDrop(eventData);

    sinon.assert.calledWith(dropTarget.processDrop, testContext);
  });

  it('should handle move by calling processMove', () => {
    const dropTarget = new DropTarget();
    sinon.spy(dropTarget, 'processMove');
    eventData.dataTransfer.dropEffect = 'move';

    dropTarget.notifyMove(eventData, testContext);

    sinon.assert.calledWith(dropTarget.processMove, testContext);
    dropTarget.processMove.restore();
  });


  it('should not move if drop did not happen successfully', () => {
    const dropTarget = new DropTarget();
    sinon.spy(dropTarget, 'processMove');
    eventData.dataTransfer.dropEffect = 'none';

    dropTarget.notifyMove(eventData, testContext);

    sinon.assert.notCalled(dropTarget.processMove);
    dropTarget.processMove.restore();
  });
});

import { Component } from 'react';

export class Draggable extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(context) {
    return (e) => {
      e.stopPropagation();
      if (this.data.parentRef) {
        this.data.parentRef.notifyMove(e, context);
      }
    };
  }

  onDragStart(context) {
    return (e) => {
      const modifiedContext = this.processDragStart(context);
      e.dataTransfer.setData('data', JSON.stringify(modifiedContext));
      e.stopPropagation();
    };
  }

  processDragStart(context) {
    return context;
  }
}

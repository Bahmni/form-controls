import { Component } from 'react';

export class DropTarget extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    e.preventDefault();
    const context = JSON.parse(e.dataTransfer.getData('data'));
    this.processDrop(context);
  }

  notifyMove(e, context) {
    if (e.dataTransfer && e.dataTransfer.dropEffect !== 'none') {
      this.processMove(context);
    }
  }

  processMove(context) {
    return context;
  }

  processDrop(context) {
    return context;
  }
}

import { Component } from 'react';

export class DropTarget extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  onDragEnter(e) {
    this.processDragEnter(e);
  }

  onDragLeave(e) {
    this.processDragLeave(e);
  }

  onDragOver(e) {
    e.preventDefault();
    this.processDragOver(e);
  }

  onDrop(e) {
    e.preventDefault();
    const context = JSON.parse(e.dataTransfer.getData('data'));
    this.processDrop(context);
    e.stopPropagation();
  }

  notifyMove(e, context) {
    if (e.dataTransfer && e.dataTransfer.dropEffect !== 'none') {
      this.processMove(context);
    }
  }

  processMove(context) {
    return context;
  }

  processDragEnter(e) {
    return e;
  }

  processDragLeave(e) {
    return e;
  }

  processDragOver(e) {
    return e;
  }

  processDrop(context) {
    return context;
  }
}

import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'chat-window',
  template: `
    <style>
        #chat {
            position: fixed;
            background-color: black;
            opacity: 0.8;
        }
        .chat-corner-resize {
            position: absolute;
            width: 10px;
            height: 10px;
            cursor: all-scroll;
        }
        #chat-top-left-resize { top: 0px; left: 0px; }
        #chat-top-right-resize { top: 0px; right: 0px; }
        #chat-bottom-left-resize { bottom: 0px; left: 0px; }
        #chat-bottom-right-resize { bottom: 0px; right: 0px; }

    </style>
    <div id='chat' [style.top.px]='y'
                   [style.left.px]='x'
                   [style.width.px]='width'
                   [style.height.px]='height'
                   (mousedown)='onWindowPress($event)'
                   (mousemove)='onWindowDrag($event)'>
                   
        <div (mousedown)='onCornerClick($event, topLeftResize)' id='chat-top-left-resize' class='chat-corner-resize'></div>    
        <div (mousedown)='onCornerClick($event, topRightResize)' id='chat-top-right-resize' class='chat-corner-resize'></div>    
        <div (mousedown)='onCornerClick($event, bottomLeftResize)' id='chat-bottom-left-resize' class='chat-corner-resize'></div>    
        <div (mousedown)='onCornerClick($event, bottomRightResize)' id='chat-bottom-right-resize' class='chat-corner-resize'></div>    
    </div> 
  `
})
export class ResComponent implements OnInit {

  x: number;
  y: number;
  px: number;
  py: number;
  width: number;
  height: number;
  minArea: number;
  draggingCorner: boolean;
  draggingWindow: boolean;
  resizer: Function;

  constructor() {
    this.x = 300;
    this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width = 600;
    this.height = 300;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 20000
  }

  ngOnInit() {
  }

  area() {
    return this.width * this.height;
  }

  onWindowPress(event: MouseEvent) {
    this.draggingWindow = true;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  onWindowDrag(event: MouseEvent) {
    if (!this.draggingWindow) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    this.x += offsetX;
    this.y += offsetY;
    this.px = event.clientX;
    this.py = event.clientY;
  }

  topLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.y += offsetY;
    this.width -= offsetX;
    this.height -= offsetY;
  }

  topRightResize(offsetX: number, offsetY: number) {
    this.y += offsetY;
    this.width += offsetX;
    this.height -= offsetY;
  }

  bottomLeftResize(offsetX: number, offsetY: number) {
    this.x += offsetX;
    this.width -= offsetX;
    this.height += offsetY;
  }

  bottomRightResize(offsetX: number, offsetY: number) {
    this.width += offsetX;
    this.height += offsetY;
  }

  onCornerClick(event: MouseEvent, resizer?: Function) {
    this.draggingCorner = true;
    this.px = event.clientX;
    this.py = event.clientY;
    this.resizer = resizer;
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    let offsetX = event.clientX - this.px;
    let offsetY = event.clientY - this.py;

    let lastX = this.x;
    let lastY = this.y;
    let pWidth = this.width;
    let pHeight = this.height;

    this.resizer(offsetX, offsetY);
    if (this.area() < this.minArea) {
      this.x = lastX;
      this.y = lastY;
      this.width = pWidth;
      this.height = pHeight;
    }
    this.px = event.clientX;
    this.py = event.clientY;
  }

  @HostListener('document:mouseup', ['$event'])
  onCornerRelease(event: MouseEvent) {
    this.draggingWindow = false;
    this.draggingCorner = false;
  }
}

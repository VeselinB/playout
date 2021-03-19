import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[resizer]'
})
export class ResizeDirective implements OnInit, OnDestroy {
  height: number;
  oldY = 0;
  grabber = false;
  destroy$ = new Subject();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.height = parseInt(this.el.nativeElement.parentNode.offsetHeight, 10);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(): void {
    this.grabber = false;
    this.destroy$.next();
  }

  @HostListener('mousedown', ['$event']) onResize(event: MouseEvent, resizerCallback?: Function) {
    this.grabber = true;
    this.oldY = event.clientY;
    event.preventDefault();

    this.addMouseMoveListener();
  }

  resizer(offsetY: number): void {
    this.height += offsetY;
    this.el.nativeElement.parentNode.style.height = this.height + 'px';
  }

  addMouseMoveListener(): void {
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.mouseMoveCallback.bind(this));
  }

  mouseMoveCallback(event: MouseEvent): void {
    if (!this.grabber) {
      return;
    }

    this.resizer(event.clientY - this.oldY);
    this.oldY = event.clientY;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
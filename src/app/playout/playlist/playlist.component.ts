import { Component, OnInit, Input, AfterViewInit, SimpleChanges, OnChanges, HostListener, Directive, ViewChild, TemplateRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnChanges {

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
  bottom = 0
  leftdiv;
  heigthdiv;
  @Input() playlist;
  @Input() channel;
  @Input() type;


  @Output() copyOrCutArr: EventEmitter<any> = new EventEmitter();
  @Output() position: EventEmitter<any> = new EventEmitter();
  @Output() pasteC: EventEmitter<any> = new EventEmitter();
  objectKeys = []
  open: boolean = false;
  markedKey = [];
  indexTemp;
  copyOrCut;


  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  @ViewChild('callAPIDialog', { static: false }) callAPIDialog: TemplateRef<any>;
  @ViewChild('chat', { static: false }) container: ElementRef<any>;
  @ViewChild('corner', { static: false }) corner: ElementRef<any>;
  @ViewChild('help', { static: false }) help: ElementRef<any>;


  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item) {
    event.clientX
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
    // if (this.arrForCopyCutPaste.length > 0) {
    //   this.disabledButton = false
    // } else {
    //   this.disabledButton = true
    // }
  }

  @HostListener('wheel', ['$event'])
  onDocumentMousewheelEvent(event) {
    console.log(this.container.nativeElement.scrollTop)
    //console.log(event)



    var st = event.clientY // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (event.deltaY > 0) {
      // downscroll code
      //  this.bottom -= 10
      console.log("down")
    } else {
      console.log("up")

      //this.bottom += 10
    }

  }


  @HostListener('keydown.delete', ['$event'])

  @HostListener('keydown.control.a', ['$event'])
  @HostListener('keydown.control.c', ['$event'])
  @HostListener('keydown.control.x', ['$event'])
  @HostListener('keydown.control.v', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event)
    if (event.key == "a" || event.key == "A") {

      this.markedKey = this.objectKeys
      this.position.emit({ Ids: this.markedKey, type: this.type })

    }

    //copy
    if (event.key == "c" || event.key == "C") {

      this.copy()

    }

    //cut
    if (event.key == "x" || event.key == "X") {

      this.cut()

    }

    //paste
    if (event.key == "v" || event.key == "V") {

      this.paste()

    }

    if (event.key == "Delete") {
      console.log(event.key)
      this.remove()

    }
  }
  constructor(public dataService: DataService) {
    this.x = 300;
    this.y = 100;
    this.px = 0;
    this.py = 0;
    this.width = 600;
    this.height = 400;
    this.draggingCorner = false;
    this.draggingWindow = false;
    this.minArea = 20000
    this.leftdiv = this.width - 10
    this.heigthdiv = 0;
  }

  ngOnInit() {
    console.log(this.playlist)


  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (Object.keys(this.playlist).length == 0) {
      this.playlist = { a: { a: "empty" } }
    }
    this.objectKeys = Object.keys(this.playlist);

  }
  cut() {
    this.copyOrCut = "cut"
    this.copyOrCutArr.emit({ channel: this.channel, listOfIds: this.markedKey, order: this.copyOrCut, type: this.type });


  }
  copy() {
    this.copyOrCut = "copy"
    this.copyOrCutArr.emit({ channel: this.channel, listOfIds: this.markedKey, order: this.copyOrCut, type: this.type });

  }
  paste() {
    this.pasteC.emit()
    //this.dataService.sendData('paste', { type: this.type, channel: this.channel, listOfIds: this.copyOrCutArr, position: this.markedKey, order: this.copyOrCut })
    this.copyOrCutArr.emit([]);
  }
  remove() {
    this.dataService.sendData('delete', { type: this.type, channel: this.channel, listOfIds: this.markedKey })
  }


  mark(key, event, index) {
    console.log(index)
    console.log(this.channel)
    if (event.shiftKey == true) {
      if (index < this.indexTemp) {
        for (let i = index; i < this.indexTemp; i++) {
          this.markedKey.push(this.objectKeys[i]);

        }
      } else {
        for (let i = index; i > this.indexTemp; i--) {
          this.markedKey.push(this.objectKeys[i]);

        }
      }
    } else {
      this.markedKey = []
      this.markedKey.push(key);
    }
    this.position.emit({ Ids: this.markedKey, type: this.type })
    this.indexTemp = index;
  }
  onRightClick(event) {
    // event.preventDefault();
  }
  /////////////////
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
    let offsetLeft = 0;
    let offsetTop = 0;



  }



  @HostListener('document:mousemove', ['$event'])
  onCornerMove(event: MouseEvent) {
    if (!this.draggingCorner) {
      return;
    }
    this.leftdiv = this.width - 10
    this.heigthdiv;
    if (this.corner.nativeElement.offsetTop < this.height) {
      //this.heigthdiv = this.height - this.corner.nativeElement.offsetTop-20
    } else {

    }
    // this.heigthdiv = 0

    console.log(this.help.nativeElement.offsetTop)
    console.log(this.corner.nativeElement.offsetTop)
    // console.log(this.height)
    console.log(this.height - this.help.nativeElement.offsetTop - 20)
    this.heigthdiv = this.height - this.help.nativeElement.offsetTop - 20


    offsetLeft: 605
    //console.log(this.heigthdiv)
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

import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appCtrA]'
})
export class CtrADirective {
  @HostListener('document:keydown.control.a', ['$event']) onKeyDown(e) {


    console.log('shift and tab');

  }
  constructor() { }

}

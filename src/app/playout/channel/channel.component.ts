import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../data.service'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {
  playlists = [{ playlist: {}, type: "onAir" }, { playlist: {}, type: "review" }]
  channel;
  playlist = { test: "1" };
  review = {};
  subscription: Subscription;
  copyOrCutArr;
  position;
  ative1 = "true";
  ative2 = false;

  constructor(private route: ActivatedRoute, public dataService: DataService, private renderer: Renderer2) {

    this.route.paramMap.subscribe(params => {

      //console.log(params["params"]["channel"]);
      this.channel = params["params"]["channel"]
      this.dataService.sendData('channel', this.channel);

    });
    this.subscription = this.dataService.getPlaylist()
      .subscribe(res => {

        if (res.channel == this.channel) {
          this.playlist = res.playlists.onAir
          this.review = res.playlists.review
          console.log(this.playlist);
        }

      })
  }
  @ViewChild('app', { static: false }) app: ElementRef;
  @ViewChild('rev', { static: false }) rev: ElementRef;
  ngOnInit() {


  }

  ngOnDestroy() {

    this.subscription.unsubscribe()
  }
  setActivePlaylist(info) {
    if (info == "app") {
      this.renderer.setStyle(this.app.nativeElement, 'z-index', '1');
      this.renderer.setStyle(this.rev.nativeElement, 'z-index', '0');
    } else {
      this.renderer.setStyle(this.app.nativeElement, 'z-index', '0');
      this.renderer.setStyle(this.rev.nativeElement, 'z-index', '1');
    }

  }
  onRightClick(event) {
    event.preventDefault();
  }
  paste() {
    console.log(this.position, this.copyOrCutArr)
    if (this.copyOrCutArr.length != 0) {
      this.dataService.sendData('paste', { position: this.position, data: this.copyOrCutArr })
    }
  }

  receiveDataForCutCopy($event) {
    this.copyOrCutArr = $event;
    console.log($event)
  }
  receivePostionForPaste($event) {
    console.log($event)
    this.position = $event
  }
}

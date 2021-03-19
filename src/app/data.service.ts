import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private socket: Socket) { }
  public sendData(type, data) {
    // console.log(message)
    this.socket.emit(type, data);
  }

  observer
  getListOfChannels(): Observable<any> {
    this.socket.on('channels', (res) => {
      this.observer.next(res);
    });
    return this.getListOfChannelsObservable();
  }
  getListOfChannelsObservable(): Observable<any> {
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  observerPlaylist
  getPlaylist(): Observable<any> {
    this.socket.on('playlist', (res) => {
      this.observerPlaylist.next(res);
    });
    return this.getPlaylistObservable();
  }
  getPlaylistObservable(): Observable<any> {
    return new Observable(observerPlaylist => {
      this.observerPlaylist = observerPlaylist;
    });
  }
}

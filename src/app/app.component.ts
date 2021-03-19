import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'playoutSystemSocketIo2';
  channels;
  constructor(private dataServise: DataService) {

  }
  ngOnInit() {
    this.getListOfChannels()
  }

  getListOfChannels(): void {
    this.dataServise.getListOfChannels()
      .subscribe(data => {
        this.channels = JSON.parse(data)
        //console.log(this.channels)

      })
  }

}

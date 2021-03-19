import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelComponent } from './playout/channel/channel.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MaterialModule } from './material/material.module';
import { PlaylistComponent } from './playout/playlist/playlist.component';
import { CtrADirective } from './ctr-a.directive';

import { AngularDraggableModule } from 'ngx-draggable-resize';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResComponent } from './res/res.component';
import { ResizeDirective } from './resize.directive';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    ChannelComponent,
    PlaylistComponent,
    CtrADirective,
    ResComponent,
    ResizeDirective
  ],
  imports: [
    DragDropModule,
    AngularDraggableModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

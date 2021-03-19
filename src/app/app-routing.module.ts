import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelComponent } from './playout/channel/channel.component'


const routes: Routes = [

  {
    path: 'playout/:channel',
    component: ChannelComponent,

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { PlacementComponent } from './placement/placement.component';

const routes: Routes = [
  { path: '',  component: IntroComponent, pathMatch: 'full' },
  { path: 'placement',  component: PlacementComponent, pathMatch: 'full' },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

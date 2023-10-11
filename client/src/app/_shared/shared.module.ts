import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [NgxSpinnerModule.forRoot({ type: 'pacman' })],
  exports: [NgxSpinnerModule],
})
export class SharedModule {}

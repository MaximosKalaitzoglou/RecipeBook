import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [
    NgxSpinnerModule.forRoot({ type: 'pacman' }),
    BsDropdownModule.forRoot(),
  ],
  exports: [NgxSpinnerModule, BsDropdownModule],
})
export class SharedModule {}
